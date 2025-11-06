import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from './routes/auth';
import  errandsRoutes  from './routes/errands';
import  paymentsRoutes  from './routes/payments';
import { startWorkers } from "./workers";
import { connectDB } from "./utils/db";
import { redis } from "./config/redis";


export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/errands", errandsRoutes);
  app.use("/payments", paymentsRoutes);

  app.use(errorHandler);

  return app;

  (async () => {
  await connectDB();
  await startworkers();

  app.listen(3000, () => {
    console.log("ERS backend running on port 3000");
  })

await redis.set("foo", "bar");
const value = await redis.get("foo");
console.log(value);
})
} 

