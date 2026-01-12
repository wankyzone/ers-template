import { Request, Response, NextFunction } from "express";
import { supabaseClient } from "../utils/supabaseClient";
import { supabaseAdmin } from "../utils/supabaseAdmin";

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

  // 1️⃣ Verify token with ANON client
  const { data, error } = await supabaseClient.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // 2️⃣ Load role from DB with SERVICE ROLE
  const { data: profile, error: profileError } =
    await supabaseAdmin
      .from("users")
      .select("id, email, role")
      .eq("id", data.user.id)
      .single();

  if (profileError || !profile) {
    return res.status(403).json({ error: "User profile not found" });
  }

  // 3️⃣ Attach enriched user to request
  (req as any).user = {
    id: profile.id,
    email: profile.email,
    role: profile.role,
  };

  next();
};
