-- USERS (clients + runners + admins)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text check (role in ('client', 'runner', 'admin')) not null,
  full_name text,
  phone text unique,
  trust_score numeric default 0,
  created_at timestamptz default now()
);

-- ERRANDS
create table public.errands (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.users(id) on delete cascade,
  runner_id uuid references public.users(id) on delete set null,
  title text not null,
  description text,
  status text check (status in ('pending','accepted','in_progress','completed','cancelled')) default 'pending',
  price numeric not null,
  location jsonb, -- { pickup: ..., dropoff: ... }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PAYMENTS
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  errand_id uuid references public.errands(id) on delete cascade,
  client_id uuid references public.users(id),
  runner_id uuid references public.users(id),
  amount numeric not null,
  status text check (status in ('pending','success','failed','refunded')) default 'pending',
  created_at timestamptz default now()
);

-- LOYALTY POINTS
create table public.loyalty (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  points int default 0,
  updated_at timestamptz default now()
);

-- INDEXES
create index idx_errands_status on public.errands(status);
create index idx_payments_status on public.payments(status);
