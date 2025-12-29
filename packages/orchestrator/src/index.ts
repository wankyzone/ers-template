import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Queue } from "bullmq";

export class Orchestrator {
  private queue: Queue;
  private supabase: SupabaseClient;

  constructor(queueName: string) {
    const redisHost = process.env.REDIS_HOST ?? "127.0.0.1";
    const redisPort = Number(process.env.REDIS_PORT ?? 6379);

    this.queue = new Queue(queueName, {
      connection: { host: redisHost, port: redisPort }
    });

    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    this.supabase = createClient(url, key);
  }

  async runJob(
    taskName: string,
    payload: any,
    options?: {
      attempts?: number;
      backoff?: { type: "fixed" | "exponential"; delay: number };
    }
  ) {
    // You can extend this to log into Supabase etc.
    await this.queue.add(taskName, payload, {
      attempts: options?.attempts ?? 3,
      backoff: options?.backoff ?? { type: "fixed", delay: 1000 }
    });
  }
}
