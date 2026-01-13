import { supabase } from "../config/supabase";
import { supabaseAdmin } from "../config/supabaseAdmin";
import { assertValidTransition } from "../domain/errandGuards";
import { logAuditEvent } from "./audit.service";
import { AppError } from "../utils/AppError";

/**
 * CLIENT — create errand
 */
export async function createErrandService(
  clientId: string,
  role: string,
  title: string,
  description: string
) {
  if (role !== "client") {
    throw new AppError("Only clients can create errands", 403);
  }

  const { data, error } = await supabaseAdmin
    .from("errands")
    .insert({
      client_id: clientId,
      title,
      description,
      status: "pending",
    })
    .select()
    .single();

  if (error || !data) {
    throw new AppError("Failed to create errand", 500);
  }

  await logAuditEvent({
    actorId: clientId,
    actorRole: role,
    action: "ERRAND_CREATED",
    entity: "errand",
    entityId: data.id,
  });

  return data;
}

/**
 * RUNNER — accept errand
 */
export async function acceptErrandService(
  runnerId: string,
  role: string,
  errandId: string
) {
  if (role !== "runner") {
    throw new AppError("Only runners can accept errands", 403);
  }

  const { data: errand } = await supabase
    .from("errands")
    .select("status")
    .eq("id", errandId)
    .single();

  if (!errand) {
    throw new AppError("Errand not found", 404);
  }

  assertValidTransition(errand.status, "accepted");

  const { data, error } = await supabase
    .from("errands")
    .update({
      status: "accepted",
      runner_id: runnerId,
    })
    .eq("id", errandId)
    .eq("status", "pending")
    .select()
    .single();

  if (error || !data) {
    throw new AppError("Cannot accept errand", 400);
  }

  await logAuditEvent({
    actorId: runnerId,
    actorRole: role,
    action: "ERRAND_ACCEPTED",
    entity: "errand",
    entityId: data.id,
  });

  return data;
}

/**
 * RUNNER — start errand
 */
export async function startErrandService(
  runnerId: string,
  errandId: string
) {
  const { data: errand } = await supabase
    .from("errands")
    .select("status, runner_id")
    .eq("id", errandId)
    .single();

  if (!errand) {
    throw new AppError("Errand not found", 404);
  }

  if (errand.runner_id !== runnerId) {
    throw new AppError("Not your errand", 403);
  }

  assertValidTransition(errand.status, "in_progress");

  const { data, error } = await supabase
    .from("errands")
    .update({ status: "in_progress" })
    .eq("id", errandId)
    .eq("runner_id", runnerId)
    .select()
    .single();

  if (error || !data) {
    throw new AppError("Cannot start errand", 400);
  }

  return data;
}

/**
 * RUNNER — complete errand
 */
export async function completeErrandService(
  runnerId: string,
  errandId: string
) {
  const { data: errand } = await supabase
    .from("errands")
    .select("status, runner_id")
    .eq("id", errandId)
    .single();

  if (!errand) {
    throw new AppError("Errand not found", 404);
  }

  if (errand.runner_id !== runnerId) {
    throw new AppError("Not your errand", 403);
  }

  assertValidTransition(errand.status, "completed");

  const { data, error } = await supabase
    .from("errands")
    .update({ status: "completed" })
    .eq("id", errandId)
    .eq("runner_id", runnerId)
    .select()
    .single();

  if (error || !data) {
    throw new AppError("Cannot complete errand", 400);
  }

  return data;
}

/**
 * CLIENT — get own errands
 */
export async function getClientErrandsService(clientId: string) {
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
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError("Failed to fetch errands", 500);
  }

  return data;
}
