import { Worker } from "bullmq";
export declare function createWorker(queueName: string, handler: (job: any) => Promise<void>): Worker<any, any, string>;
