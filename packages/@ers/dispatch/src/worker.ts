import { Worker } from "bullmq";
import { redisConnection } from "@ers/redis";

export function createWorker(queueName: string, handler: (job: any) => Promise<void>) {
  return new Worker(queueName, async (job) => {
    await handler(job);
  }, { connection: redisConnection });
}
