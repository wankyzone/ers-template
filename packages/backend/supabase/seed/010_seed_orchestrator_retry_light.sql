-- LIGHT traffic seed for orchestrator_retry_log
-- Small dataset, mostly successful retries

delete from public.orchestrator_retry_log where job_id like 'seed-light-%';

insert into public.orchestrator_retry_log (job_id, queue_name, retry_number, delay_ms, status, error_message, created_at)
values
  ('seed-light-job-001', 'errand_assignment', 1, 5000, 'success', null, now() - interval '6 hours'),
  ('seed-light-job-002', 'notification_dispatch', 1, 5000, 'retrying', 'Push provider 500', now() - interval '5 hours 30 minutes'),
  ('seed-light-job-002', 'notification_dispatch', 2, 15000, 'success', null, now() - interval '5 hours 15 minutes'),
  ('seed-light-job-003', 'email_dispatch', 1, 5000, 'success', null, now() - interval '4 hours'),
  ('seed-light-job-004', 'payment_capture', 1, 5000, 'retrying', 'Gateway timeout', now() - interval '3 hours 30 minutes'),
  ('seed-light-job-004', 'payment_capture', 2, 15000, 'success', null, now() - interval '3 hours 15 minutes');
