# InstaOps CRM

Instagram DM order operating system for small Instagram business owners.

This branch contains a functional demo MVP for **Luna Boutique**. It turns Instagram-style customer messages into structured order cards, shows orders, CRM, products, suppliers, delivery exports, finance, automation rules, and safe Meta webhook stubs.

## Demo login

- `owner@luna.demo` / `demo123`
- `manager@luna.demo` / `demo123`
- `staff@luna.demo` / `demo123`

The login screen is a demo role selector for MVP presentation. Production should replace it with Supabase Auth.

## Implemented

- Next.js App Router + TypeScript
- Responsive SaaS dashboard UI
- Realistic Luna Boutique demo data
- Instagram Inbox with deterministic mock extraction
- Create order from DM
- Orders table and kanban-style lanes
- Order status editing
- Search and filters
- CSV export for order and shipper lists
- Customer CRM view
- Product and supplier views
- Finance dashboard
- Automation rules page
- Instagram connection demo page
- Safe API stubs:
  - `GET /api/meta/webhook`
  - `POST /api/meta/webhook`
  - `POST /api/instagram/send-message`
- Supabase schema migration in `supabase/migrations/202606270001_instaops_crm_schema.sql`

## Supabase

The migration creates a dedicated `instaops` schema so it does not overwrite existing public tables in the connected Supabase project.

Tables included:

- businesses
- profiles
- team_members
- customers
- instagram_conversations
- instagram_messages
- products
- suppliers
- orders
- order_items
- supplier_order_batches
- supplier_order_batch_items
- shipments
- payments
- expenses
- crm_notes
- tasks
- automation_rules
- audit_logs

## Compliance boundary

This MVP does not scrape Instagram and does not ask for Instagram usernames or passwords. Real production integration should use official Meta OAuth, Instagram Messaging API permissions, and webhook review.

## Local setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## What is mocked

- Demo login
- Instagram message ingestion
- AI extraction
- Sending replies
- Supabase writes from the UI

## Next steps

1. Replace demo login with Supabase Auth.
2. Run the migration and seed data in Supabase.
3. Add Supabase client queries/mutations to replace in-memory demo state.
4. Configure official Meta app, OAuth, permissions, and webhooks.
5. Add XLSX export and supplier batch persistence.
