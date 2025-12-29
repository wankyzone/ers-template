import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const createErrand = async (req: Request, res: Response) => {
  const { title, description, pickup_location, dropoff_location, amount } =
    req.body;

  const { data, error } = await supabase.from("errands").insert([
    {
      client_id: (req as any).user.id,
      title,
      description,
      pickup_location,
      dropoff_location,
      amount,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ success: true });
};

export const listErrands = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("errands")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
};

export const acceptErrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("errands")
    .update({
      runner_id: (req as any).user.id,
      status: "accepted",
      accepted_at: new Date(),
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ success: true });
};

export const completeErrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("errands")
    .update({
      status: "completed",
      completed_at: new Date(),
    })
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ success: true });
};
