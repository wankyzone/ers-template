import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import errandsRoutes from "./routes/errands";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/errands", errandsRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`ERS Backend running on port ${PORT}`);
});
