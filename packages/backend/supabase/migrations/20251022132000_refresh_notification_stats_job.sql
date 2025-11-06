-- ======================================================
-- Migration: Refresh Job for Notification Analytics View
-- ======================================================

-- 1. Create function to refresh materialized view
create or replace function public.refresh_notification_stats_view()
returns void
language plpgsql
as $$
begin
  refresh materialized view concurrently public.notification_stats_view;
end;
$$;

-- 2. Create a Supabase pgcron job to refresh every 5 minutes
-- (requires 'pg_cron' extension which Supabase supports)
select cron.schedule(
  'refresh_notification_stats',
  '*/5 * * * *',  -- every 5 minutes
  $$call public.refresh_notification_stats_view();$$
);
