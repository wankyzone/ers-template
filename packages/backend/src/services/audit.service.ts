import { supabaseAdmin } from "../config/supabaseAdmin";

interface AuditLogInput {
  actorId?: string;
  actorRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(input: AuditLogInput) {
  await supabaseAdmin.from("audit_logs").insert({
    actor_id: input.actorId ?? null,
    actor_role: input.actorRole ?? null,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? null,
  });
}
