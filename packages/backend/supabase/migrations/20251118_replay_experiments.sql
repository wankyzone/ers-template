create table if not exists public.orchestrator_replay_experiments (
  id uuid primary key default gen_random_uuid(),
  profile text not null check (profile in ('light', 'medium', 'heavy')),
  label text, -- optional note like "tuned auto-rerun policy v2"
  started_at timestamptz not null default now(),
  finished_at timestamptz,

  -- Before metrics
  before_total_jobs bigint,
  before_dlq_count bigint,
  before_retrying_count bigint,
  before_success_count bigint,

  -- After metrics
  after_total_jobs bigint,
  after_dlq_count bigint,
  after_retrying_count bigint,
  after_success_count bigint,

  -- Derived deltas (for convenience)
  delta_dlq bigint,
  delta_success bigint,

  -- Raw context
  context jsonb default '{}'::jsonb
);
