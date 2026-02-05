"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("@ers/redis");
function getQueue(queueName) {
    return new bullmq_1.Queue(queueName, { connection: redis_1.redisConnection });
}
async function enqueueJob(queueName, payload, opts) {
    const q = getQueue(queueName);
    await q.add(payload.job_name ?? "job", payload, opts?.delayMs ? { delay: opts.delayMs } : undefined);
}
async function moveToDLQ(job) {
    const dlq = getQueue(`${job.queue_name}_dlq`);
    await dlq.add(job.job_name ?? "dlq_job", job);
}
