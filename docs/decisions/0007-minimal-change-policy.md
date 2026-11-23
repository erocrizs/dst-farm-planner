# 0007: Minimal-change policy: no refactors or library upgrades

- Status: Accepted
- Date: 2026-11-23
- Deciders: owner

## Context

The app is Vue 2.6 on Vue CLI 4 (both end-of-life) in plain JavaScript, with no tests, linter or CI. A modernization (Vue 3, Vite, TypeScript) was considered. The owner's priorities are: minimize code changes for now, minimize hosting cost, and get a hosted product as soon as possible.

## Decision

Do not refactor or upgrade libraries unless necessary for security. Stay on Vue 2, Vue CLI 4 and plain JavaScript. New dependencies must be additive (for example Vue Router 3, the Vue 2 compatible line, and the Supabase client) and justified in the PR description. Do not mass-reformat existing code when adding lint or format tooling.

Necessary changes that are allowed because they do not count as refactors: changing `publicPath` for the new host ([0002](0002-hosting-cloudflare-pages.md)), adding routing, and adding the save/load layer.

## Alternatives considered

- **Vue 3 + Vite + TypeScript first:** better long-term and gives faster tests, but delays the hosted product and risks regressions in an untested codebase.

## Consequences

- Vue 2 receives no security patches. Mitigation: never render user-written text with `v-html` (enforced in review rules), keep dependencies few, and revisit the migration when it becomes necessary or after launch. Record any future migration as a new decision.
- Tests are added only for new or touched logic (Row Level Security, the crop column mapping, the save function), not as a campaign over existing code. The test runner choice is an open item in the roadmap.
