"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchBroker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("@ers/redis");
const registry_1 = require("./registry");
class DispatchBroker {
    constructor(service) {
        this.service = service;
        const queueName = (0, registry_1.resolveServiceQueue)(service);
        this.queue = new bullmq_1.Queue(queueName, { connection: redis_1.redisConnection });
        new bullmq_1.QueueEvents(queueName, { connection: redis_1.redisConnection });
    }
    async dispatch(jobName, payload, opts = {}) {
        return this.queue.add(jobName, payload, {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
            ...opts,
        });
    }
}
exports.DispatchBroker = DispatchBroker;
