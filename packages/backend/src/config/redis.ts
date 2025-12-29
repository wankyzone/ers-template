import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  username: process.env.REDIS_USER!,
  password: process.env.REDIS_PASS!,
  tls: {}, // keep if rediss://, remove otherwise
});

redis.on("connect", () => console.log("Connected to Redis Cloud"));
redis.on("error", (err) => console.error("Redis connection error:", err));

export async function verifyRedis() {
  try {
    const pong = await redis.ping();
    console.log("Redis ping:", pong);
  } catch (error) {
    console.error("Redis verification failed:", error);
  } finally {
    redis.disconnect();
  }
}
