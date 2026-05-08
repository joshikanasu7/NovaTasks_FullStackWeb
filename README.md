# TaskNova (Role-Based Dashboards)

Production-ready Next.js + Supabase starter for admin/member dashboards with role-based access control.

## Setup

1. Copy `.env.example` to `.env.local` and fill keys.
2. Install dependencies:
   - `npm install`
3. Run SQL in `supabase/schema.sql` in Supabase SQL editor.
4. Start app:
   - `npm run dev`

## Simplest run

Use one command:

- `npm run dev:easy`

It will:
- auto-create `.env.local` from `.env.example` if missing
- start Next.js dev server on `http://localhost:3000`

## Supabase Auth (no email confirmation)

To allow direct signup/login (no mail confirmation):

1. Open Supabase Dashboard -> `Authentication` -> `Providers` -> `Email`.
2. Turn **off** `Confirm email`.
3. Save.

If this stays on, users cannot login immediately after signup.

## Simple SQL to create users/roles

Use this only when you want to manually create role records for existing auth users:

```sql
insert into public.users (id, email, full_name, role)
values ('AUTH_USER_UUID', 'admin@example.com', 'Admin User', 'admin')
on conflict (id) do update set role = excluded.role;
```

```sql
insert into public.users (id, email, full_name, role)
values ('AUTH_USER_UUID', 'member@example.com', 'Member User', 'member')
on conflict (id) do update set role = excluded.role;
```

After running the updated `schema.sql`, normal signup creates these profile rows automatically.

## Included

- Admin routes:
  - `/admin/dashboard`
  - `/admin/users`
  - `/admin/projects`
  - `/admin/tasks`
  - `/admin/analytics`
  - `/admin/settings`
- Member routes:
  - `/member/dashboard`
  - `/member/tasks`
  - `/member/projects`
  - `/member/notifications`
  - `/member/profile`
- Security:
  - Middleware route protection
  - Role guards in layouts
  - Supabase RLS schema and policies
  - Member-only own-task update flow
