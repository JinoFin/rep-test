# Apex CE Operations

Private internal task and document review system for Apex CE daily operations.

Implemented so far:

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase Auth client setup
- protected app shell
- login/logout
- profile role model
- Supabase schema/RLS/storage migration design
- task CRUD for Milestone 2
- My Tasks and All Tasks lists with filters
- create/edit/detail task pages
- status, priority, and risk badges
- task detail comments
- task detail activity log
- assigned-user limited status/notes update foundation
- private task file upload/list/download with signed URLs
- task requirements checklist and manual requirement status management

AI review, Gmail import, and WeCom preparation are intentionally deferred.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Row Level Security
- Vercel-ready deployment

## Local Setup

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env.local
```

Set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

Apply the migration in `supabase/migrations` to your Supabase project.

With Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Create users in Supabase Auth, then insert matching rows into `profiles` with
the same `auth.users.id`.

Roles:

- `admin`
- `manager`
- `user`
- `viewer`

The Storage bucket is `task-files` and must remain private.

Use signed URLs for file downloads/previews. Do not create permanent public file
URLs.

## Routes

Implemented now:

- `/login`
- `/dashboard`
- `/my-tasks`
- `/all-tasks`
- `/authority-cases`
- `/customers`
- `/tasks/new`
- `/tasks/[id]`
- `/tasks/[id]/edit`
- `/settings`

All routes except `/login` are protected by `src/proxy.ts` and the protected app
layout.

## Task Pages

- `/my-tasks`: shows tasks assigned to the signed-in user. Filters include
  status, priority, deadline, customer, and authority.
- `/all-tasks`: admin/manager-only task overview. Filters include assigned
  person, status, priority, risk, deadline, customer, and authority.
- `/tasks/new`: admin/manager-only create form.
- `/tasks/[id]`: task detail page with files, requirements, comments, and
  activity log. AI review is still a placeholder.
- `/tasks/[id]/edit`: admin/manager-only edit form.

Task creation, updates, limited assigned-user status changes, and comments write
simple `activity_log` rows.

File uploads:

- use the private `task-files` bucket
- write metadata to `task_files`
- store paths as `tasks/{task_id}/{incoming|uploads|generated}/{file_id}-{filename}`
- use `/tasks/[id]/files/[fileId]/download` to generate a short-lived signed URL
- never expose permanent public URLs

Requirements:

- admin/manager can add, edit, and delete requirements
- each requirement has a required file category and status
- allowed statuses are `missing`, `uploaded`, `passed`, `failed`,
  `manual_review`, and `manually_approved`
- manual approval requires written feedback
- uploading a file with a matching category moves missing requirements to
  uploaded

Known limitations:

- Normal users can use the limited status/notes update panel only on assigned
  tasks. Admins/managers use the full edit page.
- RLS policies are hardened for task reads and writes. SQL policy tests live in
  `supabase/tests/task_rls.sql`.
- Task detail placeholders do not run AI review.

## Architecture Notes

See `docs/architecture.md` for the long-term design.

Important boundaries:

- AI review must never claim legal approval, 100% compliance, or guaranteed
  authority acceptance.
- Gmail import must never mark mail as read, delete/archive mail, or send
  replies automatically.
- WeCom support must prepare messages for human confirmation only.
- Authority submission must never be automatic.

## Commands

```bash
npm run lint
npm run build
npm test
```

`npm run build` uses Next's webpack build path because the default Turbopack
build can require local worker behavior that is blocked in restricted Codex
sandboxes. Vercel can still build the app normally.

Run database policy tests from a configured Supabase local environment:

```bash
supabase test db
```

## Future Milestones

- Milestone 7: Mock AI review, structured review JSON, manual override.
- Milestone 8: Dashboards.
- Milestone 9: Unit and Playwright hardening.
- Milestone 10: Gmail import preparation.
