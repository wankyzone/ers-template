import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("✅ ERS Backend is running successfully!"));
app.use("/auth", authRoutes);

export default app;
