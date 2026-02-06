import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import errandsRoutes from "./routes/errands";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/logger";

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/errands", errandsRoutes);
app.use(errorHandler);

export default app;
