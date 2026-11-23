# 0003: Sign-in: Discord and Google OAuth only

- Status: Accepted
- Date: 2026-11-23
- Deciders: owner

## Context

Farms are tied to signed-in users, and the global feed shows the author. Supabase Auth supports email and OAuth providers.

## Decision

Support **Discord** and **Google** OAuth at launch. No email/password or magic-link sign-in. No account linking at launch.

Each user gets a `profiles` row on first login with a unique, user-editable username, seeded from the provider's display name. The feed shows the username. The provider email is never exposed.

## Alternatives considered

- **Email (password or magic link):** works for everyone, but Supabase's built-in email sender is heavily rate-limited and for testing only, so production needs a custom SMTP provider and DNS records. Without email confirmation, fake signups need CAPTCHA (Supabase supports Cloudflare Turnstile). Slowest, least predictable part of launch.
- **GitHub OAuth:** trivial setup, but the wrong audience for a game tool.

## Consequences

- Players without a Discord or Google account cannot sign in. Add email later if requested.
- The same person using Google one day and Discord the next gets two accounts, and farms do not carry over (identity linking only works when emails match and are verified). Documented limitation.
- OAuth redirect URLs must be allowlisted per environment: localhost, production, and the Cloudflare preview domains.
- Owner action needed: register a Discord application and a Google Cloud OAuth consent screen and client, then enter the credentials in the Supabase dashboard (never in the repo).
