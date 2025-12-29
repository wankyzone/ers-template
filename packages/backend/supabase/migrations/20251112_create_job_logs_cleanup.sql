create table if not exists orchestrator_dlq (
  id uuid primary key default gen_random_uuid(),
  job_id text,
  queue_name text,
  reason text,-- retention function to prune old job_logs and dlq entries
create or replace function public.cleanup_old_orchestrator_logs(in_days int)
returns void language plpgsql as $$
begin
  delete from public.job_logs where created_at < now() - (make_interval(days => in_days));
  delete from public.orchestrator_dlq where created_at < now() - (make_interval(days => in_days));
end;
$$;

-- schedule via pg_cron to run daily at 03:30
select cron.schedule(
  'cleanup_orchestrator_logs_daily',
  '30 3 * * *',
  $$call public.cleanup_old_orchestrator_logs(30);$$
);

  payload jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_orch_dlq_queue on orchestrator_dlq (queue_name);
create index if not exists idx_orch_dlq_created on orchestrator_dlq (created_at desc);

-- retention function to prune old job_logs and dlq entries
create or replace function public.cleanup_old_orchestrator_logs(in_days int)
returns void language plpgsql as $$
begin
  delete from public.job_logs where created_at < now() - (make_interval(days => in_days));
  delete from public.orchestrator_dlq where created_at < now() - (make_interval(days => in_days));
end;
$$;

-- schedule via pg_cron to run daily at 03:30
select cron.schedule(
  'cleanup_orchestrator_logs_daily',
  '30 3 * * *',
  $$call public.cleanup_old_orchestrator_logs(30);$$
);
