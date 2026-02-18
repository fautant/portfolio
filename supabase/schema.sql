-- Contact Messages table
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null,
  email text not null,
  subject text not null,
  type text not null check (type in ('job', 'freelance', 'question', 'other')),
  message text not null
);

-- Project Proposals table
create table if not exists project_proposals (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null,
  email text not null,
  company text,
  budget text not null check (budget in ('<1000', '1000-5000', '5000-10000', '>10000')),
  deadline text not null,
  description text not null
);

-- Enable Row Level Security
alter table contact_messages enable row level security;
alter table project_proposals enable row level security;

-- Policy: only service_role can insert (API routes use service_role key)
create policy "Service role can insert contact messages"
  on contact_messages for insert
  to service_role
  with check (true);

create policy "Service role can read contact messages"
  on contact_messages for select
  to service_role
  using (true);

create policy "Service role can insert proposals"
  on project_proposals for insert
  to service_role
  with check (true);

create policy "Service role can read proposals"
  on project_proposals for select
  to service_role
  using (true);
