"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrandService = createErrandService;
exports.acceptErrandService = acceptErrandService;
exports.startErrandService = startErrandService;
exports.completeErrandService = completeErrandService;
exports.getClientErrandsService = getClientErrandsService;
exports.getAvailableErrandsForRunnerService = getAvailableErrandsForRunnerService;
const supabase_1 = require("../supabase");
const supabaseAdmin_1 = require("../config/supabaseAdmin");
const errandGuards_1 = require("../domain/errandGuards");
const audit_service_1 = require("./audit.service");
const AppError_1 = require("../utils/AppError");
/**
 * CLIENT — create errand
 */
async function createErrandService(clientId, role, title, description) {
    if (role !== "client") {
        throw new AppError_1.AppError("Only clients can create errands", 403);
    }
    const { data, error } = await supabaseAdmin_1.supabaseAdmin
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
        throw new AppError_1.AppError("Failed to create errand", 500);
    }
    await (0, audit_service_1.logAuditEvent)({
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
async function acceptErrandService(runnerId, role, errandId) {
    if (role !== "runner") {
        throw new AppError_1.AppError("Only runners can accept errands", 403);
    }
    const { data: errand } = await supabase_1.supabase
        .from("errands")
        .select("status")
        .eq("id", errandId)
        .single();
    if (!errand) {
        throw new AppError_1.AppError("Errand not found", 404);
    }
    (0, errandGuards_1.assertValidTransition)(errand.status, "accepted");
    const { data, error } = await supabase_1.supabase
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
        throw new AppError_1.AppError("Cannot accept errand", 400);
    }
    await (0, audit_service_1.logAuditEvent)({
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
async function startErrandService(runnerId, errandId) {
    const { data: errand } = await supabase_1.supabase
        .from("errands")
        .select("status, runner_id")
        .eq("id", errandId)
        .single();
    if (!errand) {
        throw new AppError_1.AppError("Errand not found", 404);
    }
    if (errand.runner_id !== runnerId) {
        throw new AppError_1.AppError("Not your errand", 403);
    }
    (0, errandGuards_1.assertValidTransition)(errand.status, "in_progress");
    const { data, error } = await supabase_1.supabase
        .from("errands")
        .update({ status: "in_progress" })
        .eq("id", errandId)
        .eq("runner_id", runnerId)
        .select()
        .single();
    if (error || !data) {
        throw new AppError_1.AppError("Cannot start errand", 400);
    }
    return data;
}
/**
 * RUNNER — complete errand
 */
async function completeErrandService(runnerId, errandId) {
    const { data: errand } = await supabase_1.supabase
        .from("errands")
        .select("status, runner_id")
        .eq("id", errandId)
        .single();
    if (!errand) {
        throw new AppError_1.AppError("Errand not found", 404);
    }
    if (errand.runner_id !== runnerId) {
        throw new AppError_1.AppError("Not your errand", 403);
    }
    (0, errandGuards_1.assertValidTransition)(errand.status, "completed");
    const { data, error } = await supabase_1.supabase
        .from("errands")
        .update({ status: "completed" })
        .eq("id", errandId)
        .eq("runner_id", runnerId)
        .select()
        .single();
    if (error || !data) {
        throw new AppError_1.AppError("Cannot complete errand", 400);
    }
    return data;
}
/**
 * CLIENT — get own errands
 */
async function getClientErrandsService(clientId) {
    const { data, error } = await supabase_1.supabase
        .from("errands")
        .select(`
        id,
        title,
        description,
        status,
        price,
        created_at,
        runner_id
      `)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
    if (error) {
        throw new AppError_1.AppError("Failed to fetch errands", 500);
    }
    return data;
}
async function getAvailableErrandsForRunnerService(runnerId) {
    const { data, error } = await supabaseAdmin_1.supabaseAdmin
        .from("errands")
        .select("*")
        .eq("status", "created");
    if (error)
        throw error;
    return data;
}
