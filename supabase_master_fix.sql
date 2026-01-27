-- MASTER FIX SCRIPT
-- Run this entire script in Supabase SQL Editor to reset everything and fix permissions.

-- 1. Reset Table
drop table if exists tables cascade;

create table tables (
  id text primary key,
  status text default 'EMPTY',
  items jsonb default '[]',
  amount numeric default 0,
  notes text default '',
  last_paid numeric default 0,
  paid_orders jsonb default '[]',
  started_at bigint, 
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Fix Permissions (Allow everyone to Read/Write)
alter table tables enable row level security;

-- Drop existing policy if it exists to avoid error
drop policy if exists "Enable all access for anon" on tables;

create policy "Enable all access for anon" on tables
  for all
  using (true)
  with check (true);

-- 3. Turn on Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table tables;
commit;
-- Or simpler: alter publication supabase_realtime add table tables; 
-- But often 'supabase_realtime' exists by default. Let's try the safe add:
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end
$$;
alter publication supabase_realtime add table tables;


-- 4. Insert Data
insert into tables (id, status, items, amount, last_paid, paid_orders)
values 
('1', 'EMPTY', '[]', 0, 0, '[]'),
('2', 'EMPTY', '[]', 0, 0, '[]'),
('3', 'EMPTY', '[]', 0, 0, '[]'),
('4', 'EMPTY', '[]', 0, 0, '[]'),
('5', 'EMPTY', '[]', 0, 0, '[]'),
('6', 'EMPTY', '[]', 0, 0, '[]');
