-- Migration: orchestrator_retry_log (retry analytics)
create table if not exists public.orchestrator_retry_log (
  id uuid primary key default gen_random_uuid(),
  job_id text not null,
  queue_name text not null,
  retry_number int not null,
  delay_ms int not null default 0,
  status text not null check (status in ('retrying','success','failed')),
  error_message text,
  created_at timestamptz default now()
);

create index if not exists idx_orch_retry_jobid on public.orchestrator_retry_log (job_id);
create index if not exists idx_orch_retry_queue on public.orchestrator_retry_log (queue_name);
create index if not exists idx_orch_retry_created on public.orchestrator_retry_log (created_at desc);
