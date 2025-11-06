-- ======================================================
-- Migration: Materialized View for Notification Analytics
-- ======================================================

-- Drop existing normal view
drop view if exists public.notification_stats_view;

-- Drop materialized view if exists (for redeploys)
drop materialized view if exists public.notification_stats_view;

-- Create materialized view
create materialized view public.notification_stats_view as
select
  date_trunc('day', created_at) as day,
  count(*) as total_sent,
  count(*) filter (where status = 'failed') as total_failed,
  count(*) filter (where status = 'sent') as total_delivered,
  count(*) filter (where status = 'pending') as total_pending,
  round(
    (count(*) filter (where status = 'failed')::decimal / greatest(count(*), 1)) * 100,
    2
  ) as failure_rate,
  avg(extract(epoch from (sent_at - created_at))) as avg_delivery_time_seconds
from public.notification_logs
group by 1
order by 1 desc;

-- Index to speed up refresh & queries
create unique index if not exists idx_notification_stats_day
  on public.notification_stats_view (day);

-- Permissions
grant select on public.notification_stats_view to authenticated;
grant select on public.notification_stats_view to anon;
