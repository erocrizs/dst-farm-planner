# 0001: Backend and database: Supabase free tier

- Status: Accepted
- Date: 2026-11-23
- Deciders: owner

## Context

Farms must move from `localStorage` to a database tied to signed-in users. Constraints: minimize cost, ship a hosted product quickly, write as little backend code as possible (see [0007](0007-minimal-change-policy.md)).

## Decision

Use Supabase (managed Postgres, Auth, Row Level Security) on the free plan. The browser talks to Supabase directly; there is no custom backend server. Schema changes are SQL migrations managed with the Supabase CLI and reviewed in PRs.

Free-plan projects are paused after about a week of low activity. To avoid that, a scheduled GitHub Actions workflow runs a real database query (a REST `select` on a small table, using the public anon key and a read-only policy) every 3 days. This is a **stopgap**: Supabase's documentation says low-activity projects "may be paused" but does not officially define what counts as activity; third-party sources say real database queries count, and a ping over plain HTTP may not. Real user traffic makes the ping unnecessary. If a pause ever happens despite the ping, restore from the dashboard (data is kept) and consider upgrading to Pro.

Free limits as of 2026-11 (verify before relying on them; see Supabase pricing): 500 MB database, 5 GB egress per month, 50,000 monthly active users, 2 active projects.

## Alternatives considered

- **Firebase (Firestore + Auth):** generous free tier and no pausing, but combined feed filters (season plus several numeric ranges plus sorting) are awkward in Firestore, security rules are a separate language, and server logic needs a paid plan with a card on file.
- **Cloudflare Workers + D1:** cheap and never pauses, but means writing the API and auth ourselves: the most code and slowest route.
- **PocketBase (self-hosted):** one binary with auth and DB, but needs a server (about a small VPS cost) and the owner would run backups and uptime.
- **Fastify + Prisma + AWS (as in the owner's other project, Puzura):** most code and highest cost; conflicts with every philosophy in [CLAUDE.md](../../CLAUDE.md).

## Consequences

- Row Level Security policies are the whole security layer. A policy mistake is a data leak, so policy changes need tests and extra review (see [../product/farms-and-feed.md](../product/farms-and-feed.md)).
- Lock-in is mild: it is plain Postgres.
- GitHub scheduled workflows have their own caveats (they can be disabled after long repository inactivity; they use Actions minutes). Check the keep-alive workflow occasionally.
