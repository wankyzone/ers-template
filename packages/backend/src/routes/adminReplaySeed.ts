import type { Request, Response } from "express";
import { runReplaySeedForProfile } from "../services/replaySeedService";

const VALID_PROFILES = ["light", "medium", "heavy"] as const;
type Profile = (typeof VALID_PROFILES)[number];

export async function adminReplaySeedHandler(req: Request, res: Response) {
  try {
    const profile = (req.body?.profile || "medium") as Profile;

    if (!VALID_PROFILES.includes(profile)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid profile. Use light | medium | heavy.",
      });
    }

    // Optional: require admin role from auth middleware
    // if (!req.user || req.user.role !== "admin") {
    //   return res.status(403).json({ ok: false, error: "Forbidden" });
    // }

    // Optional: restrict to non-production
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        ok: false,
        error: "Replay from seed is disabled in production.",
      });
    }

    await runReplaySeedForProfile(profile);

    return res.json({ ok: true, profile });
  } catch (err: any) {
    console.error("adminReplaySeedHandler error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error while replaying from seed.",
    });
  }
}
