# TaskNova

TaskNova is a full-stack task management app built with Next.js and Supabase.
It includes role-based dashboards for `admin` and `member`, secure route protection, and Supabase RLS policies.

## Features

- Role-based dashboards (`admin` and `member`)
- Auth with Supabase (signup/login/logout)
- Protected routes with middleware + layout guards
- Task/project/user management APIs
- Supabase schema with RLS policies

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Supabase (Auth + Postgres)
- Tailwind CSS

## Quick Start

1. Clone the repository.
2. Install dependencies:
   - `npm install`
3. Create environment file:
   - copy `.env.example` to `.env.local`
4. In Supabase SQL Editor, run:
   - `supabase/schema.sql`
5. Start development server:
   - `npm run dev`

App runs at `http://localhost:3000`.

## One-Command Local Run

Use:

- `npm run dev:easy`

This command auto-creates `.env.local` from `.env.example` (if missing) and starts the app.

## Environment Variables

Set these in `.env.local` (and in Railway/production):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Auth Setting (Important)

For instant signup/login without email verification:

1. Supabase Dashboard -> `Authentication` -> `Providers` -> `Email`
2. Turn off `Confirm email`
3. Save

## Main Routes

### Admin

- `/admin/dashboard`
- `/admin/users`
- `/admin/projects`
- `/admin/tasks`
- `/admin/analytics`
- `/admin/settings`

### Member

- `/member/dashboard`
- `/member/tasks`
- `/member/projects`
- `/member/notifications`
- `/member/profile`

## Security

- Middleware route protection
- Role checks in protected layouts
- Supabase RLS policies
- Member-only own-task update flow

## Manual Role Insert (Optional)

If you need to assign a role for an existing auth user manually:

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

## Deployment (Railway)

1. Push project to GitHub.
2. Create new Railway project from the GitHub repo.
3. Add environment variables from above.
4. Deploy.

Build command:
- `npm run build`

Start command:
- `npm run start`
