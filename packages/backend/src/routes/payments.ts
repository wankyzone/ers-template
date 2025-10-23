import { Router } from "express";
import { supabase } from "../supabase";

const router = Router();

// Record payment
router.post("/", async (req, res) => {
  const { errand_id, client_id, runner_id, amount } = req.body;
  const { data, error } = await supabase.from("payments").insert([{ errand_id, client_id, runner_id, amount }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Get payments
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("payments").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
