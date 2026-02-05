import { Queue, JobsOptions } from "bullmq";
import { redisConnection } from "@ers/redis";

export function getQueue(queueName: string) {
  return new Queue(queueName, { connection: redisConnection });
}

export async function enqueueJob(queueName: string, payload: any, opts?: { delayMs?: number }) {
  const queue = getQueue(queueName);
  const options: JobsOptions = {};
  if (opts?.delayMs && opts.delayMs > 0) options.delay = opts.delayMs;
  await queue.add(queueName, payload, options);
}

export async function moveToDLQ(job: any) {
  // minimal DLQ strategy: enqueue into `${queueName}:dlq`
  const dlqName = `${job.queue_name}:dlq`;
  await enqueueJob(dlqName, job, { delayMs: 0 });
}
