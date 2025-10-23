import { Router } from "express";
import { supabase } from "../supabase";

const router = Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  // insert user profile
  await supabase.from("users").insert([{ id: data.user?.id, email, role }]);
  res.json({ user: data.user });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
