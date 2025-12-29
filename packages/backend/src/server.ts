import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errandsRoutes from "./routes/errands";
import authRoutes from "./routes/auth";

import { requestLogger } from "./middlewares/logger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/errands", errandsRoutes);

// Middlewares
app.use(requestLogger);

// Routes
app.use("/errands", errandsRoutes);
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
  };
// 404 + Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ERS Backend running on port ${PORT}`);
});
