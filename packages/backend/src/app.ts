import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("✅ ERS Backend is running successfully!"));
app.use("/auth", authRoutes);

export default app;
