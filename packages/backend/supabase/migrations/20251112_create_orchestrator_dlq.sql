create table if not exists orchestrator_dlq (
  id uuid primary key default gen_random_uuid(),
  job_id text,
  queue_name text,
  reason text,
  payload jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_orch_dlq_queue on orchestrator_dlq (queue_name);
create index if not exists idx_orch_dlq_created on orchestrator_dlq (created_at desc);
