"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJob = registerJob;
exports.getJobHandler = getJobHandler;
exports.listJobs = listJobs;
exports.resolveServiceQueue = resolveServiceQueue;
const registry = new Map();
function registerJob(type, handler) {
    registry.set(type, handler);
}
function getJobHandler(type) {
    return registry.get(type);
}
function listJobs() {
    return Array.from(registry.keys());
}
function resolveServiceQueue(service) {
    // consistent naming = easier ops/debugging
    return `ers:${service}`;
}
