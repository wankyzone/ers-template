insert into public.notification_logs (job_id, title, message, recipient, status, created_at)
values
  ('test-job-1', 'Welcome to ERS', 'Your test notification has been queued successfully.', 'demo@ers.local', 'sent', now()),
  ('test-job-2', 'Runner Update', 'A runner is nearby for your test errand.', 'demo@ers.local', 'pending', now()),
  ('test-job-3', 'System Alert', 'This is a failed notification simulation.', 'demo@ers.local', 'failed', now());
