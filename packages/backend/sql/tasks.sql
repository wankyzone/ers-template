create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price integer,
  location text,
  status text not null default 'open',
  accepted_by text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.tasks
  add column if not exists accepted_by text,
  add column if not exists completed_at timestamptz;
