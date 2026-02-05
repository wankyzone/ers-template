"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = createWorker;
const bullmq_1 = require("bullmq");
const redis_1 = require("@ers/redis");
function createWorker(queueName, handler) {
    return new bullmq_1.Worker(queueName, async (job) => {
        await handler(job);
    }, { connection: redis_1.redisConnection });
}
