# DST Farm Planner

A browser-based farm planner for *Don't Starve Together*. The app lives in `farm-planner/` (Vue 2.6, Vue CLI 4, plain JavaScript). Farms are currently saved in `localStorage`; the project is being extended with accounts, a database, per-farm URLs and a public feed. Development is AI-driven.

## Start here

- `docs/README.md` indexes all documentation. Read it before starting work.
- `docs/plans/roadmap.md` is the phased plan with task breakdown and dependencies. Tasks are tracked in the **DST Farm Planner** Vikunja project (resolve the project and task ids by name; never guess ids).
- `docs/product/farms-and-feed.md` is the product and data spec (privacy levels, schema, security design, feed filter).
- `docs/decisions/` holds one record per decision, with the reasoning and the alternatives rejected.

This file holds only **finalized** decisions. Proposals and open questions live in `docs/` with their status marked.

## Key philosophies (owner, 2026-11-23)

1. **Minimize code changes for now.** Do not refactor or upgrade libraries unless it is necessary for security. Vue 2, Vue CLI 4 and plain JavaScript stay. New dependencies must be additive and justified in the PR description.
2. **Minimize hosting cost.** Free tiers first; do not add paid services without the owner's approval.
3. **Get a hosted product as soon as possible.** Prefer the smallest vertical slice that ships.

## Finalized decisions

Details and alternatives are in `docs/decisions/`.

| Area | Decision |
|---|---|
| Backend and database | Supabase free tier: Postgres, Auth, Row Level Security. No custom backend server. Schema changes are SQL migrations (Supabase CLI). |
| Keep-alive | A scheduled GitHub Action runs a real database query every 3 days so the free project does not pause. A stopgap. |
| Hosting | Cloudflare Pages (free). Start on the `*.pages.dev` address. |
| Sign-in | Discord and Google OAuth only. No email sign-in at launch. No account linking at launch. |
| Privacy levels | `private` (default), `unlisted`, `public`. |
| Global feed | Shows `public` farms only. Filters: one season plus minimum yield per crop (all conditions combined with AND). |
| Yield storage | Crop counts only (no seeds), one integer column per crop on the `farms` table. |
| PR review | Automatic AI review on PR open and `@claude` on demand, using the owner's Claude subscription token. The repository must be **private** for this to be allowed (see ADR 0006). |

## Security rules that agents must follow

- Privacy is enforced in the database (Row Level Security and database functions), never only in the client. Any change to a policy or database function needs a test and gets extra review.
- The `farms` table must not be readable by everyone for `unlisted` rows: only `public` rows and the owner's own rows are readable through the table. A single farm is fetched by id through a `security definer` function (see `docs/product/farms-and-feed.md`).
- Never use `v-html` (or any raw HTML rendering) on user-written text such as farm names, descriptions or usernames. Vue 2 no longer receives security patches.
- Never commit secrets. The Supabase anon key is public by design; the service-role key and OAuth client secrets must never be committed or sent to the browser.
- Never `select *` from `farms` in the feed; the row holds the full tile `data`. List the columns.
- Keys in `farm-planner/src/library/crops.js` are stored in the database as column names (see the mapping in `docs/product/farms-and-feed.md`). Do not rename a crop key without a migration.

## Repository layout

- `farm-planner/`: the Vue app. `src/library/` holds game data and the farm model (`crops.js`, `FarmData.js`, `TileData.js`, `PlotData.js`, ...); `src/components/` holds the UI.
- `docs/`: documentation.
- Root files such as `CLAUDE.md`, `REVIEW.md`, `.github/` and `.claude/` are added in roadmap Phase 1.

## Working principles

- Small, vertical, verifiable pull requests. One task, one branch, one PR.
- Do not add technology ahead of need.
- When a decision is finalized, record it here and in a decision record; update the status of the document where it was discussed.
- Keep the root `README.md` setup section and command table current whenever setup steps or scripts change (once Phase 1 adds them).
