import { Queue, QueueEvents, JobsOptions } from "bullmq";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { logJobEvent } from "./logger";
import { handleDLQ } from "./dlq";

dotenv.config();

type DispatchOptions = {
  attempts?: number;                 // total attempts
  backoff?: {type: 'exponential'|'fixed', delay: number}; // backoff spec
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
  priority?: number;
  jobId?: string;
  delay?: number;
};

export class Orchestrator {
  private queue: Queue;
  private events: QueueEvents;
  supabase: ReturnType<typeof createClient>;
  queueName: string;

  constructor(queueName: string) {
    this.queueName = queueName;
    this.queue = new Queue(queueName, { connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: +(process.env.REDIS_PORT || 6379) } });
    this.events = new QueueEvents(queueName, { connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: +(process.env.REDIS_PORT || 6379) } });
    this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // attach event listeners for automatic DLQ capture
    this.events.on('failed', async ({ jobId, failedReason, prev }) => {
      try {
        // fetch job attempt count and either handle DLQ or log failure
        await handleDLQ(this.supabase, this.queueName, jobId as string, failedReason);
      } catch (err) {
        console.error('DLQ handler error', err);
      }
    });
  }

  // standardize bullmq JobOptions from our DispatchOptions
  private toJobOptions(opts?: DispatchOptions): JobsOptions {
    const attempts = opts?.attempts ?? 3;
    const backoff = opts?.backoff
      ? opts.backoff.type === 'exponential'
        ? { type: 'exponential', delay: opts.backoff.delay }
        : { type: 'fixed', delay: opts.backoff.delay }
      : { type: 'exponential', delay: 2000 };

    return {
      attempts,
      backoff,
      removeOnComplete: opts?.removeOnComplete ?? true,
      removeOnFail: opts?.removeOnFail ?? false,
      priority: opts?.priority,
      jobId: opts?.jobId,
      delay: opts?.delay,
    };
  }

  // dispatch a job with retries/backoff and log lifecycle events
  async runJob(jobName: string, payload: any, opts?: DispatchOptions) {
    await logJobEvent(this.supabase, jobName, 'started', { payload, queue: this.queueName });

    const jobOptions = this.toJobOptions(opts);

    const job = await this.queue.add(jobName, payload, jobOptions);

    await logJobEvent(this.supabase, jobName, 'queued', { jobId: job.id });

    return job;
  }

  // convenience: chain sequential tasks (each returns a Promise)
  async chainSequential(tasks: Array<() => Promise<any>>) {
    const results = [];
    for (const t of tasks) {
      results.push(await t());
    }
    return results;
  }

  // convenience: run tasks in parallel
  async chainParallel(tasks: Array<() => Promise<any>>) {
    return Promise.all(tasks.map(t => t()));
  }

  // conditional helper
  async conditional(condition: boolean, task: () => Promise<any>) {
    if (condition) return task();
    return null;
  }
}
