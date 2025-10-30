import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from './routes/auth';
import  errandsRoutes  from './routes/errands';
import  paymentsRoutes  from './routes/payments';


export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/errands", errandsRoutes);
  app.use("/payments", paymentsRoutes);

  app.use(errorHandler);

  return app;
}
