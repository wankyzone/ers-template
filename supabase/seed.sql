-- Seed test users
insert into auth.users (id, email) values
  (gen_random_uuid(), 'client_demo@ers.app'),
  (gen_random_uuid(), 'runner_demo@ers.app');

-- Seed errands
insert into public.errands (title, description, status, client_id)
values ('Pickup package', 'Deliver from Ikeja to Yaba', 'pending', (select id from auth.users limit 1));

-- Seed payments
insert into public.payments (amount, status, errand_id)
values (2000, 'pending', (select id from public.errands limit 1));
