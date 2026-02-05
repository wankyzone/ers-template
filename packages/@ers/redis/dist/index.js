"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
exports.createRedis = createRedis;
const ioredis_1 = __importDefault(require("ioredis"));
__exportStar(require("./redis"), exports);
exports.redisConnection = new ioredis_1.default(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
exports.redisConnection.on("error", (err) => {
    console.error("Redis connection error:", err);
});
function createRedis(url) {
    const redisUrl = url ?? process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
    return new ioredis_1.default(redisUrl);
}
