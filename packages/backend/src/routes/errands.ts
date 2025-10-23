import { Router } from "express";
import { supabase } from "../supabase";

const router = Router();

// Create errand
router.post("/", async (req, res) => {
  const { client_id, title, description, price, location } = req.body;
  const { data, error } = await supabase.from("errands").insert([{ client_id, title, description, price, location }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Get all errands
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("errands").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Accept errand
router.post("/:id/accept", async (req, res) => {
  const { id } = req.params;
  const { runner_id } = req.body;
  const { data, error } = await supabase.from("errands").update({ runner_id, status: "accepted" }).eq("id", id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

export default router;
