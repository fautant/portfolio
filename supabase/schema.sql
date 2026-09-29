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

-- =========================================================
-- Espace /outils : projets de design et historique de prompts
-- (accès limité au propriétaire via RLS, client Supabase avec session)
-- =========================================================
create table if not exists design_projects (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null,
  site_type text not null,
  brief jsonb not null default '{}',
  lexique jsonb not null default '{}',
  maquettes jsonb not null default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists prompt_history (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null references design_projects on delete cascade,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  kind text not null check (kind in ('lexique', 'maquette')),
  label text,
  prompt text not null,
  created_at timestamptz default now() not null
);

create index if not exists design_projects_owner_idx on design_projects (owner_id, updated_at desc);
create index if not exists prompt_history_project_idx on prompt_history (project_id, created_at desc);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists design_projects_updated_at on design_projects;
create trigger design_projects_updated_at
  before update on design_projects
  for each row execute function set_updated_at();

alter table design_projects enable row level security;
alter table prompt_history enable row level security;

create policy "Owner manages own projects"
  on design_projects for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owner manages own prompt history"
  on prompt_history for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
