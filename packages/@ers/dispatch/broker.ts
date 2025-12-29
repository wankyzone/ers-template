import { Queue, QueueScheduler } from "bullmq";
import { redisConnection } from "@ers/redis";
import { resolveServiceQueue } from "./registry";

export class DispatchBroker {
  private queue: Queue;

  constructor(private service: string) {
    const queueName = resolveServiceQueue(service);
    this.queue = new Queue(queueName, { connection: redisConnection });
    new QueueScheduler(queueName, { connection: redisConnection });
  }

  async dispatch(jobName: string, payload: any, opts = {}) {
    return this.queue.add(jobName, payload, {
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      ...opts,
    });
  }
}
