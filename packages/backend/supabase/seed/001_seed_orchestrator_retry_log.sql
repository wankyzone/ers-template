-- Seed data for orchestrator_retry_log
-- Simulates multiple queues, retries, successes and DLQ failures
-- Time window: last 7 days

delete from public.orchestrator_retry_log where job_id like 'seed-%';

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  -- DAY -6
  ('seed-job-001', 'email_dispatch', 1, 5000, 'retrying', 'SMTP timeout', now() - interval '6 days 23 hours'),
  ('seed-job-001', 'email_dispatch', 2, 15000, 'success', null, now() - interval '6 days 22 hours 50 minutes'),
  ...
;
