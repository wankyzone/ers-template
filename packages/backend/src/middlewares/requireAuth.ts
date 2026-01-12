import { Request, Response, NextFunction } from "express";
import { supabaseClient } from "../utils/supabaseClient";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // 1️⃣ Verify token
  const { data, error } = await supabaseClient.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // 2️⃣ Fetch profile (THIS WAS MISSING)
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("id, email, role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return res.status(401).json({ error: "User profile not found" });
  }

  // 3️⃣ Attach real user
  (req as any).user = profile;

  next();
};
