-- Create the tables table
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

-- Turn on Realtime for this table
alter publication supabase_realtime add table tables;

-- Insert initial 6 tables
insert into tables (id, status, items, amount, last_paid, paid_orders)
values 
('1', 'EMPTY', '[]', 0, 0, '[]'),
('2', 'EMPTY', '[]', 0, 0, '[]'),
('3', 'EMPTY', '[]', 0, 0, '[]'),
('4', 'EMPTY', '[]', 0, 0, '[]'),
('5', 'EMPTY', '[]', 0, 0, '[]'),
('6', 'EMPTY', '[]', 0, 0, '[]');
