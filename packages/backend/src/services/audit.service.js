"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditEvent = logAuditEvent;
const supabaseAdmin_1 = require("../config/supabaseAdmin");
async function logAuditEvent(input) {
    await supabaseAdmin_1.supabaseAdmin.from("audit_logs").insert({
        actor_id: input.actorId ?? null,
        actor_role: input.actorRole ?? null,
        action: input.action,
        entity: input.entity,
        entity_id: input.entityId ?? null,
        metadata: input.metadata ?? null,
    });
}
