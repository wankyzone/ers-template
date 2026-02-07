"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "").trim();
    // 1️⃣ Verify token
    const { data, error } = await supabaseClient_1.supabaseClient.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    // 2️⃣ Fetch profile (THIS WAS MISSING)
    const { data: profile, error: profileError } = await supabaseClient_1.supabaseClient
        .from("profiles")
        .select("id, email, role")
        .eq("id", data.user.id)
        .single();
    if (profileError || !profile) {
        return res.status(401).json({ error: "User profile not found" });
    }
    // 3️⃣ Attach real user
    req.user = profile;
    next();
};
exports.requireAuth = requireAuth;
