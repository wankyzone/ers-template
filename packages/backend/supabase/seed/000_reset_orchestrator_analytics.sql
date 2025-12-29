-- Reset script: truncate analytics + DLQ tables (dev only)

-- Disable FK checks if needed (for dev only, adjust to your schema)
-- DO AT YOUR OWN RISK in prod.
-- set session_replication_role = replica;

truncate table public.orchestrator_retry_log restart identity cascade;
truncate table public.orchestrator_dlq restart identity cascade;

-- Optionally clear any other related test tables:
-- truncate table public.orchestrator_jobs_restart identity cascade;

-- set session_replication_role = default;
