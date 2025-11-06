-- =========================================
-- Migration: Create Notification Logs Table
-- =========================================

create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  job_id text not null,
  title text not null,
  message text not null,
  recipient text not null,
  status text check (status in ('pending', 'sent', 'failed')) default 'pending',
  retry_count integer default 0,
  error_message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  sent_at timestamptz
);

-- Indexes for better query performance
create index if not exists idx_notification_logs_status on public.notification_logs (status);
create index if not exists idx_notification_logs_created_at on public.notification_logs (created_at desc);

-- Policies for Edge Function access (if using Supabase auth)
alter table public.notification_logs enable row level security;

create policy "Allow read access for authenticated users"
on public.notification_logs for select
to authenticated
using (true);

create policy "Allow insert for service role"
on public.notification_logs for insert
to service_role
with check (true);
