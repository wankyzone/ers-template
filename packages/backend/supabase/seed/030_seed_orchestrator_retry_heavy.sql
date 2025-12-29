-- HEAVY traffic seed for orchestrator_retry_log
-- High volume, more retries, more DLQ
delete from public.orchestrator_retry_log where job_id like 'seed-heavy-%';

-- Generate a busy day for each queue
-- We'll insert multiple rows per queue across several hours

-- errand_assignment - heavy but mostly recovered
insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  ('seed-heavy-job-001', 'errand_assignment', 1, 5000, 'retrying', 'Worker timeout', now() - interval '10 hours'),
  ('seed-heavy-job-001', 'errand_assignment', 2, 15000, 'success', null, now() - interval '9 hours 45 minutes'),
  ('seed-heavy-job-002', 'errand_assignment', 1, 5000, 'retrying', 'DB lock', now() - interval '9 hours'),
  ('seed-heavy-job-002', 'errand_assignment', 2, 15000, 'retrying', 'DB lock', now() - interval '8 hours 45 minutes'),
  ('seed-heavy-job-002', 'errand_assignment', 3, 45000, 'success', null, now() - interval '8 hours 30 minutes'),
  ('seed-heavy-job-003', 'errand_assignment', 1, 5000, 'success', null, now() - interval '8 hours');

-- payment_capture - heavy DLQ
insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  ('seed-heavy-job-010', 'payment_capture', 1, 5000, 'retrying', 'Gateway 504', now() - interval '7 hours'),
  ('seed-heavy-job-010', 'payment_capture', 2, 15000, 'retrying', 'Gateway 504', now() - interval '6 hours 45 minutes'),
  ('seed-heavy-job-010', 'payment_capture', 3, 45000, 'failed', 'Max retries exceeded', now() - interval '6 hours 30 minutes'),

  ('seed-heavy-job-011', 'payment_capture', 1, 5000, 'retrying', 'Gateway 503', now() - interval '6 hours'),
  ('seed-heavy-job-011', 'payment_capture', 2, 15000, 'failed', 'Max retries exceeded', now() - interval '5 hours 45 minutes'),

  ('seed-heavy-job-012', 'payment_capture', 1, 5000, 'retrying', 'Gateway 502', now() - interval '5 hours 30 minutes'),
  ('seed-heavy-job-012', 'payment_capture', 2, 15000, 'retrying', 'Gateway 502', now() - interval '5 hours 15 minutes'),
  ('seed-heavy-job-012', 'payment_capture', 3, 45000, 'success', null, now() - interval '5 hours');

-- notification_dispatch - bursty failures
insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  ('seed-heavy-job-020', 'notification_dispatch', 1, 5000, 'retrying', 'Push provider 500', now() - interval '4 hours'),
  ('seed-heavy-job-020', 'notification_dispatch', 2, 15000, 'success', null, now() - interval '3 hours 45 minutes'),
  ('seed-heavy-job-021', 'notification_dispatch', 1, 5000, 'retrying', 'Push provider 429', now() - interval '3 hours 30 minutes'),
  ('seed-heavy-job-021', 'notification_dispatch', 2, 15000, 'retrying', 'Push provider 429', now() - interval '3 hours 15 minutes'),
  ('seed-heavy-job-021', 'notification_dispatch', 3, 45000, 'success', null, now() - interval '3 hours'),

  ('seed-heavy-job-022', 'notification_dispatch', 1, 5000, 'success', null, now() - interval '2 hours 30 minutes');

-- email_dispatch - moderate failure
insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  ('seed-heavy-job-030', 'email_dispatch', 1, 5000, 'retrying', 'SMTP 421', now() - interval '2 hours'),
  ('seed-heavy-job-030', 'email_dispatch', 2, 15000, 'retrying', 'SMTP 421', now() - interval '1 hours 45 minutes'),
  ('seed-heavy-job-030', 'email_dispatch', 3, 45000, 'failed', 'Max retries exceeded', now() - interval '1 hours 30 minutes'),

  ('seed-heavy-job-031', 'email_dispatch', 1, 5000, 'success', null, now() - interval '1 hours 15 minutes'),
  ('seed-heavy-job-032', 'email_dispatch', 1, 5000, 'retrying', 'SMTP timeout', now() - interval '1 hours'),
  ('seed-heavy-job-032', 'email_dispatch', 2, 15000, 'success', null, now() - interval '45 minutes');
