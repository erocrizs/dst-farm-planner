# Roadmap

Status: adopted plan (2026-11-23). Nothing here has been started. Tasks are tracked in the **DST Farm Planner** Vikunja project; task ids below (`P1-2` and so on) are plan references, not Vikunja ids.

Guiding rules ([CLAUDE.md](../../CLAUDE.md)): minimal code changes ([0007](../decisions/0007-minimal-change-policy.md)), minimal hosting cost, hosted product as soon as possible. Phases are ordered so the app is hosted early and features follow.

```
P1 AI-dev foundation ──┐
                       ├─> P3 Supabase + auth ─> P4 Farms + URLs ─> P5 Global feed ─> P6 Migration + hardening
P2 Hosting ────────────┘
```

P1 and P2 do not depend on each other and can run in parallel. P3 needs P2 (a real URL for OAuth redirects). P4 needs P3. P5 needs P4.

## Owner-only prerequisites

Agents cannot do these; tasks that need them are blocked until the owner confirms.

| Needed for | Step |
|---|---|
| P1-4 | Make the repository private and add the `CLAUDE_CODE_OAUTH_TOKEN` secret ([0006](../decisions/0006-pr-review-private-repo.md)); check Actions minutes |
| P2 | Create a Cloudflare account and connect the GitHub repository |
| P3 | Create the Supabase project; register a Discord application and a Google OAuth client; enter the credentials in the Supabase dashboard |
| P3 | Add repository secrets for the keep-alive workflow (Supabase URL and anon key) |
| Vikunja | The API token used by the Vikunja MCP server needs project create/update/delete and the kanban bucket scopes, or agents cannot create projects or manage columns |

## Phase 1: AI-driven development foundation

Goal: agents can write, test and get automated review on PRs, set up like the owner's Puzura repo (`../puzura`, same machine) but sized for this project.

- **P1-1 Docs foundation.** `CLAUDE.md`, `docs/`, ADRs 0001 to 0007, this roadmap. *Done in the planning session; needs review and merge.*
- **P1-2 Lint config.** ESLint for Vue 2 plus plain JS, tuned to the existing style. Do **not** mass-reformat existing code; no Prettier run over the whole codebase ([0007](../decisions/0007-minimal-change-policy.md)). Add `.editorconfig`.
- **P1-3 Test runner.** Pick one that needs no change to the build and can test pure modules in `src/library/`. Open: Vitest (runs standalone on plain JS modules, verify it works with the repo's Node version and the webpack alias file) or the Vue CLI unit-jest plugin. Add one trivial test to prove the pipeline. Record the choice as a decision record.
- **P1-4 PR review workflows.** Add `REVIEW.md`, `.github/workflows/claude-review.yml` (one review when a PR is opened or marked ready) and `claude.yml` (`@claude` on demand), plus the review helper scripts from Puzura (`scripts/review-threads*.mjs`, `scripts/post-review-summary.mjs`). Pin action versions by SHA as Puzura does. Review rules to include (adapt Puzura's `REVIEW.md`):
  - Row Level Security policy or database function changes are Important and need a test.
  - No `v-html` or raw HTML on user text.
  - No `select *` on `farms` in the feed.
  - Crop key renames without a migration are Important.
  - Secrets (service-role key, OAuth secrets) in the diff are Important.
  - No new dependency without a stated reason; no refactor or library upgrade without a security reason ([0007](../decisions/0007-minimal-change-policy.md)).
  - README setup and command table kept current; docs index updated.

  Needs the owner prerequisite for P1-4 (private repository and the review token secret).
- **P1-5 CI workflow.** GitHub Actions on PRs: install, lint, test, build. Node version from `.nvmrc` or the repo's current requirement.
- **P1-6 Agent workflow.** `.claude/settings.json` and a `parallel-tasks` skill (copy and adapt from Puzura, pointed at the DST Farm Planner Vikunja project), plus `docs/standards/parallel-agents.md` (one subagent, worktree, branch and PR per task; touch disjoint files).
- **P1-7 Root README.** Setup steps and a command table (the app lives in `farm-planner/`; the root README is currently one line).

## Phase 2: Hosting

Goal: the existing app is live on Cloudflare Pages ([0002](../decisions/0002-hosting-cloudflare-pages.md)), still using `localStorage`.

- **P2-1 Deploy to Cloudflare Pages.** Build command `npm run build` in `farm-planner/`; output `dist`. Check Cloudflare's current recommended free static hosting at setup time. Needs owner prerequisite.
- **P2-2 `publicPath` fix.** `farm-planner/vue.config.js` uses `/dst-farm-planner/` in production (a subpath deployment, probably GitHub Pages). Change it so the app works at the root, without breaking existing local development. Verify image and font paths after the change.
- **P2-3 SPA fallback and smoke test.** Confirm unknown paths serve `index.html` (needed for `/farms/:id` later) and the planner works on the `*.pages.dev` address.

## Phase 3: Supabase and sign-in

Goal: users can sign in; the database and its security rules exist and are tested.

- **P3-1 Supabase CLI setup.** `supabase/` folder with config and migrations; document the local dev workflow in the README.
- **P3-2 Schema migration.** `profiles` and `farms` as in [../product/farms-and-feed.md](../product/farms-and-feed.md), the profile-creation trigger, indexes, and the `get_farm` function.
- **P3-3 Row Level Security policies and tests.** Every test listed in the product spec's security section. Blocks everything that reads or writes farms.
- **P3-4 Supabase client and sign-in UI.** Add `@supabase/supabase-js`; Discord and Google sign-in, sign-out, signed-in state in the navigation bar; username creation or edit on first login. Redirect URL allowlist for localhost, production and Cloudflare preview domains (document it). Needs owner prerequisites.
- **P3-5 Keep-alive workflow.** Scheduled GitHub Action, every 3 days, runs a real REST `select` on a small public-readable table with the anon key ([0001](../decisions/0001-backend-supabase.md)). Needs owner prerequisite (secrets).

## Phase 4: Farms and URLs

Goal: farms are saved per user, have names, descriptions, privacy and their own URL.

- **P4-1 Vue Router 3.** Add `vue-router@3` (the Vue 2 compatible line) with history mode; routes for the planner and `/farms/:id`. Keep the existing planner behavior as the default route.
- **P4-2 Save and load module.** One function that writes `data` and the 14 yield columns together; the crop key to column mapping module with its test; loading a farm by id (owner via table, others via `get_farm`).
- **P4-3 Farm metadata UI.** Name, optional description (limits), privacy selector with explicit labels, default `private`.
- **P4-4 Read-only farm page.** `/farms/:id` for non-owners, signed out or in; `noindex` for unlisted farms; shows author username; clear not-found and private states.
- **P4-5 "My farms" list.** The signed-in user's farms with privacy and quick links.

## Phase 5: Global feed

- **P5-1 Feed page and query.** Public farms only, explicit columns, newest first, keyset pagination; shows name, description, author, yield summary (labeled optimal yield).
- **P5-2 Filters.** Season and per-crop minimums (up to the 14 crops, AND); crop picker reuses `crops.js` names and images.
- **P5-3 Report and hide path.** A user can report a public farm; the owner can hide a farm by making it private; admin handling can be a manual database action at first.

## Phase 6: Migration and hardening

- **P6-1 Import local saves.** On first login offer to import existing `localStorage` farms (keys `saveSummaries` and `saveData`) into the account. Check the stored format first (see open items in the product spec).
- **P6-2 Account deletion.** Deleting an account removes or anonymizes its farms and profile.
- **P6-3 Limits.** Enforce name and description length in the database; consider a per-user farm count limit and rate limits.
- **P6-4 Revisit the stopgaps.** Keep-alive ping, Vue 2 end-of-life, and the client-supplied yield columns; decide whether any now deserves its own task.

## Open items (not decided)

- Test runner choice (P1-3).
- Exact name and description length limits (proposals in the product spec).
- Whether to add a custom domain, and when.
- Whether to add email sign-in or account linking after launch.
- Whether to migrate off Vue 2 after launch (would need a new decision record).
- Verify preferred seasons in `crops.js` against the wiki.
