-- Enable RLS (just to be safe, though we are about to open it up)
alter table tables enable row level security;

-- Create policy to allow anonymous access (select/insert/update)
-- This allows anyone with the anon key to read and write to the tables table.
-- Since this is a simple demo app without auth, this is necessary.

create policy "Enable all access for anon" on tables
  for all -- Applies to SELECT, INSERT, UPDATE, DELETE
  using (true) -- Allow all rows to be visible
  with check (true); -- Allow all rows to be modified
