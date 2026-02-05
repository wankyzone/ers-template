import Redis from "ioredis";
export * from "./redis";
export type RedisClient = Redis;
export declare const redisConnection: Redis;
export declare function createRedis(url?: string): Redis;
