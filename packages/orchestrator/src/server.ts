import express from "express";
import { replaySeedJobs } from "./services/replaySeedJobs";

const app = express();
app.use(express.json());

app.post("/internal/replay-seed-jobs", async (req, res) => {
  try {
    const profile = (req.body?.profile || "medium") as
      | "light"
      | "medium"
      | "heavy";
    if (!["light", "medium", "heavy"].includes(profile)) {
      return res.status(400).json({ ok: false, error: "Invalid profile" });
    }

    
    await replaySeedJobs(profile);
    return res.json({ ok: true, profile });
  } catch (err: any) {
    console.error("internal/replay-seed-jobs error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
});

export { app };