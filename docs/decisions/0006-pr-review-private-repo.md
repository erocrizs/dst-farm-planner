# 0006: PR review auth: subscription token, repository made private

- Status: Accepted. Owner action pending: the repository is still public as of 2026-11-23.
- Date: 2026-11-23
- Deciders: owner

## Context

Development is AI-driven and every PR should get an automatic AI review (the owner's other project, Puzura, is the reference setup: a review workflow on PR open, an on-demand `@claude` workflow, a read-only tool allowlist, a turn cap and a timeout). Puzura authenticates with the owner's Claude subscription token (`CLAUDE_CODE_OAUTH_TOKEN`), and its own docs endorse that only while the repository is private and solo. This repository was public.

## Decision

Make the repository **private** and authenticate reviews with the owner's subscription token, as in Puzura. Review workflows stay read-only and cost-capped (model, turn limit, tool allowlist, timeout) and never get write tools without the owner's approval.

## Alternatives considered

- **Keep public, use an API key with a spend limit:** hard cost cap and safe for a public repo, but pay-per-use, against the cost philosophy.
- **Keep public, use the subscription token anyway:** free, but breaks the reference setup's own rule, has no spend limit, and the terms of using a subscription token in CI on a public repo were not verified.

## Consequences

Owner-only steps (agents cannot do these):

1. Change the repository visibility to private (GitHub: Settings, Danger Zone).
2. Add the `CLAUDE_CODE_OAUTH_TOKEN` repository secret.
3. Check the GitHub Actions minutes allowance for private repos on the current plan (believed to be 2,000 per month on the free plan; verify). Reviews, CI and the keep-alive workflow all use minutes.

Cloudflare Pages and Supabase work with private repositories. Fork PRs never receive secrets, so they are not reviewed automatically (moot while the repo is private and solo). If the repository ever becomes public again or gains collaborators, switch to a workspace-scoped API key with a spend limit and restrict the `@claude` trigger to users with write access.
