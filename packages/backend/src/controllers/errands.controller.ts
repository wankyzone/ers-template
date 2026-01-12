import { RequestHandler, Response } from "express";
import { supabase } from "../config/supabase";
import { supabaseAdmin } from "../utils/supabaseAdmin";
import { AuthenticatedRequest } from "../types/authenticated-request";
import { assertValidTransition } from "../domain/errandGuards";

/**
 * CLIENT — create errand
 */
export const createErrand: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const { data, error } = await supabaseAdmin
    .from("errands")
    .insert({
      client_id: authReq.user.id,
      title,
      description,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: "Errand created",
    errand: data,
  });
};

/**
 * RUNNER — accept errand
 */
export const acceptErrand: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const { id } = req.params;

  const { data: errand } = await supabase
    .from("errands")
    .select("status")
    .eq("id", id)
    .single();

  if (!errand) {
    return res.status(404).json({ error: "Errand not found" });
  }

  assertValidTransition(errand.status, "accepted");

  const { data, error } = await supabase
    .from("errands")
    .update({
      status: "accepted",
      runner_id: authReq.user.id,
    })
    .eq("id", id)
    .eq("status", "pending")
    .select()
    .single();

  if (error || !data) {
    return res.status(400).json({ error: "Cannot accept errand" });
  }

  res.json(data);
};

/**
 * RUNNER — start errand
 */
export async function startErrand(
  req: AuthenticatedRequest,
  res: Response
) {
  const { id } = req.params;

  const { data: errand } = await supabase
    .from("errands")
    .select("status, runner_id")
    .eq("id", id)
    .single();

  if (!errand) {
    return res.status(404).json({ error: "Errand not found" });
  }

  if (errand.runner_id !== req.user!.id) {
    return res.status(403).json({ error: "Not your errand" });
  }

  assertValidTransition(errand.status, "in_progress");

  const { data, error } = await supabase
    .from("errands")
    .update({ status: "in_progress" })
    .eq("id", id)
    .eq("runner_id", req.user!.id)
    .eq("status", "accepted")
    .select()
    .single();

  if (error || !data) {
    return res.status(400).json({ error: "Cannot start errand" });
  }

  res.json(data);
}

/**
 * RUNNER — complete errand
 */
export async function completeErrand(
  req: AuthenticatedRequest,
  res: Response
) {
  const { id } = req.params;

  const { data: errand } = await supabase
    .from("errands")
    .select("status, runner_id")
    .eq("id", id)
    .single();

  if (!errand) {
    return res.status(404).json({ error: "Errand not found" });
  }

  if (errand.runner_id !== req.user!.id) {
    return res.status(403).json({ error: "Not your errand" });
  }

  assertValidTransition(errand.status, "completed");

  const { data, error } = await supabase
    .from("errands")
    .update({ status: "completed" })
    .eq("id", id)
    .eq("runner_id", req.user!.id)
    .eq("status", "in_progress")
    .select()
    .single();

  if (error || !data) {
    return res.status(400).json({ error: "Cannot complete errand" });
  }

  res.json(data);
}

export const getClientErrands: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;

  const { data, error } = await supabase
    .from("errands")
    .select(
      `
        id,
        title,
        description,
        status,
        price,
        created_at,
        runner_id
      `
    )
    .eq("client_id", authReq.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    errands: data,
  });
};