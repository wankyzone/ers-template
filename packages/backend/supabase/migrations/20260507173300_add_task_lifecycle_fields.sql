alter table public.tasks
  add column if not exists accepted_by text,
  add column if not exists completed_at timestamptz;
