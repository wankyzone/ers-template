-- Seed data for orchestrator_retry_log
-- Simulates multiple queues, retries, successes and DLQ failures
-- Time window: last 7 days

-- Clean existing test data (optional in dev)
delete from public.orchestrator_retry_log where job_id like 'seed-%';

-- Helper: generate timestamps relative to now()
-- We'll just inline them using now() - 'X days'::interval

-------------------------
-- DAY -6 (6 days ago)
-------------------------

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  -- email_dispatch queue (mostly success)
  ('seed-job-001', 'email_dispatch', 1, 5000, 'retrying', 'SMTP timeout', now() - interval '6 days 23 hours'),
  ('seed-job-001', 'email_dispatch', 2, 15000, 'success', null, now() - interval '6 days 22 hours 50 minutes'),

  ('seed-job-002', 'email_dispatch', 1, 5000, 'success', null, now() - interval '6 days 20 hours'),

  -- payment_capture queue (one that ends in DLQ)
  ('seed-job-003', 'payment_capture', 1, 5000, 'retrying', 'Gateway timeout', now() - interval '6 days 18 hours'),
  ('seed-job-003', 'payment_capture', 2, 15000, 'retrying', 'Gateway timeout', now() - interval '6 days 17 hours 45 minutes'),
  ('seed-job-003', 'payment_capture', 3, 45000, 'failed', 'Max retries exceeded', now() - interval '6 days 17 hours 30 minutes');


-------------------------
-- DAY -5 (5 days ago)
-------------------------

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  -- errand_assignment queue (critical path, some noise)
  ('seed-job-010', 'errand_assignment', 1, 5000, 'retrying', 'Runner service unavailable', now() - interval '5 days 21 hours'),
  ('seed-job-010', 'errand_assignment', 2, 15000, 'success', null, now() - interval '5 days 20 hours 50 minutes'),

  ('seed-job-011', 'errand_assignment', 1, 5000, 'success', null, now() - interval '5 days 19 hours 30 minutes'),

  -- notification_dispatch queue
  ('seed-job-012', 'notification_dispatch', 1, 5000, 'retrying', 'Push provider 500', now() - interval '5 days 18 hours'),
  ('seed-job-012', 'notification_dispatch', 2, 15000, 'success', null, now() - interval '5 days 17 hours 50 minutes');


-------------------------
-- DAY -4 (4 days ago)
-------------------------

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  -- email_dispatch
  ('seed-job-020', 'email_dispatch', 1, 5000, 'retrying', 'SMTP dropped connection', now() - interval '4 days 22 hours'),
  ('seed-job-020', 'email_dispatch', 2, 15000, 'retrying', 'SMTP dropped connection', now() - interval '4 days 21 hours 45 minutes'),
  ('seed-job-020', 'email_dispatch', 3, 45000, 'failed', 'Max retries exceeded', now() - interval '4 days 21 hours 30 minutes'),

  -- payment_capture (recovering)
  ('seed-job-021', 'payment_capture', 1, 5000, 'retrying', 'Gateway 502', now() - interval '4 days 19 hours'),
  ('seed-job-021', 'payment_capture', 2, 15000, 'success', null, now() - interval '4 days 18 hours 45 minutes');


-------------------------
-- DAY -3 (3 days ago)
-------------------------

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  -- errand_assignment high volume
  ('seed-job-030', 'errand_assignment', 1, 5000, 'success', null, now() - interval '3 days 23 hours'),
  ('seed-job-031', 'errand_assignment', 1, 5000, 'retrying', 'Worker timeout', now() - interval '3 days 22 hours'),
  ('seed-job-031', 'errand_assignment', 2, 15000, 'success', null, now() - interval '3 days 21 hours 50 minutes'),

  ('seed-job-032', 'errand_assignment', 1, 5000, 'retrying', 'Runner location lookup failed', now() - interval '3 days 21 hours'),
  ('seed-job-032', 'errand_assignment', 2, 15000, 'retrying', 'Runner location lookup failed', now() - interval '3 days 20 hours 45 minutes'),
  ('seed-job-032', 'errand_assignment', 3, 45000, 'failed', 'Max retries exceeded', now() - interval '3 days 20 hours 30 minutes');


-------------------------
-- DAY -2 (2 days ago)
-------------------------

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  -- notification_dispatch stabilizing
  ('seed-job-040', 'notification_dispatch', 1, 5000, 'success', null, now() - interval '2 days 18 hours'),
  ('seed-job-041', 'notification_dispatch', 1, 5000, 'retrying', 'Push provider 429', now() - interval '2 days 17 hours'),
  ('seed-job-041', 'notification_dispatch', 2, 15000, 'success', null, now() - interval '2 days 16 hours 45 minutes'),

  -- payment_capture still a bit flaky
  ('seed-job-042', 'payment_capture', 1, 5000, 'retrying', 'Gateway 503', now() - interval '2 days 15 hours'),
  ('seed-job-042', 'payment_capture', 2, 15000, 'failed', 'Max retries exceeded', now() - interval '2 days 14 hours 45 minutes');


-------------------------
-- DAY -1 (yesterday)
-------------------------

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  ('seed-job-050', 'errand_assignment', 1, 5000, 'success', null, now() - interval '1 days 20 hours'),
  ('seed-job-051', 'errand_assignment', 1, 5000, 'retrying', 'DB lock timeout', now() - interval '1 days 19 hours'),
  ('seed-job-051', 'errand_assignment', 2, 15000, 'success', null, now() - interval '1 days 18 hours 45 minutes'),

  ('seed-job-052', 'email_dispatch', 1, 5000, 'retrying', 'SMTP 421', now() - interval '1 days 17 hours'),
  ('seed-job-052', 'email_dispatch', 2, 15000, 'success', null, now() - interval '1 days 16 hours 45 minutes');


-------------------------
-- DAY 0 (today)
-------------------------

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  ('seed-job-060', 'errand_assignment', 1, 5000, 'retrying', 'Worker timeout', now() - interval '2 hours'),
  ('seed-job-060', 'errand_assignment', 2, 15000, 'success', null, now() - interval '1 hours 45 minutes'),

  ('seed-job-061', 'payment_capture', 1, 5000, 'retrying', 'Gateway 504', now() - interval '1 hours 30 minutes'),
  ('seed-job-061', 'payment_capture', 2, 15000, 'retrying', 'Gateway 504', now() - interval '1 hours 10 minutes'),
  ('seed-job-061', 'payment_capture', 3, 45000, 'failed', 'Max retries exceeded', now() - interval '30 minutes'),

  ('seed-job-062', 'notification_dispatch', 1, 5000, 'success', null, now() - interval '15 minutes');
