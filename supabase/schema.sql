-- TaskNova role-based schema and RLS policies

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'member');
  end if;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Creates app profile row immediately after auth signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'member')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.users.full_name);
  return new;
exception
  when invalid_text_representation then
    insert into public.users (id, email, full_name, role)
    values (
      new.id,
      new.email,
      nullif(new.raw_user_meta_data->>'full_name', ''),
      'member'
    )
    on conflict (id) do update
      set email = excluded.email,
          full_name = coalesce(excluded.full_name, public.users.full_name);
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid not null references public.users(id),
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null,
  due_date date,
  project_id uuid not null references public.projects(id) on delete cascade,
  assignee_id uuid not null references public.users(id),
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now()
);

-- Convert existing enum status column to text if database already has older schema.
alter table public.tasks
  alter column status type text using status::text;

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.users(id),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.users(id),
  action text not null,
  resource_type text not null,
  resource_id text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.activity_logs enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
as $$
  select role from public.users where id = auth.uid();
$$;

-- users policies
drop policy if exists "users self or admin read" on public.users;
create policy "users self or admin read" on public.users
for select using (id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists "admins manage users" on public.users;
create policy "admins manage users" on public.users
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- projects policies
drop policy if exists "admins full projects" on public.projects;
create policy "admins full projects" on public.projects
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "members read assigned projects" on public.projects;
create policy "members read assigned projects" on public.projects
for select using (
  exists (
    select 1 from public.tasks t
    where t.project_id = projects.id and t.assignee_id = auth.uid()
  )
);

-- tasks policies
drop policy if exists "admins full tasks" on public.tasks;
create policy "admins full tasks" on public.tasks
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "members read own tasks" on public.tasks;
create policy "members read own tasks" on public.tasks
for select using (assignee_id = auth.uid());

drop policy if exists "members update own tasks" on public.tasks;
create policy "members update own tasks" on public.tasks
for update using (assignee_id = auth.uid())
with check (assignee_id = auth.uid());

-- comments policies
drop policy if exists "task participants read comments" on public.task_comments;
create policy "task participants read comments" on public.task_comments
for select using (
  exists (
    select 1 from public.tasks t
    where t.id = task_comments.task_id
      and (t.assignee_id = auth.uid() or public.current_user_role() = 'admin')
  )
);

drop policy if exists "task participants add comments" on public.task_comments;
create policy "task participants add comments" on public.task_comments
for insert with check (
  exists (
    select 1 from public.tasks t
    where t.id = task_comments.task_id
      and (t.assignee_id = auth.uid() or public.current_user_role() = 'admin')
  )
);
