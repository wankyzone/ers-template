"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
exports.createRedis = createRedis;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redisConnection = new ioredis_1.default(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
exports.redisConnection.on("error", (err) => {
    console.error("Redis connection error:", err);
});
function createRedis(url) {
    const redisUrl = url ?? process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
    return new ioredis_1.default(redisUrl);
}
