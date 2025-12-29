import express from "express";
import cors from "cors";
import errandsRoutes from "./routes/errands";
import authRoutes from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/errands", errandsRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;
