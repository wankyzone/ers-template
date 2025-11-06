import Redis from "ioredis";
const redis = new Redis();
redis.set("test", "ok");
redis.get("test").then(console.log).finally(() => redis.quit());
