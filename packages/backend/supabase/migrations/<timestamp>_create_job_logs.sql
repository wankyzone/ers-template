create table if not exists job_logs (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,
  status text not null,
  meta jsonb,
  created_at timestamptz default now()
);
