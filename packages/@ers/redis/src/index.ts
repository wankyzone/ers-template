import Redis from "ioredis";


export * from "./redis";

export type RedisClient = Redis;

export const redisConnection = new Redis(
  process.env.REDIS_URL ?? "redis://127.0.0.1:6379"
);

redisConnection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export function createRedis(url?: string) {
  const redisUrl = url ?? process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
  return new Redis(redisUrl);
}
