# 0004: Farm privacy: private, unlisted, public

- Status: Accepted
- Date: 2026-11-23
- Deciders: owner

## Context

The owner's original spec had two states, "private" and "sharing" (viewable by URL and listed in the global feed). The owner chose three levels because link-only sharing is what users expect and the extra effort is small.

## Decision

Each farm has a `privacy` value:

| Value | Who can view by URL | Listed in the feed |
|---|---|---|
| `private` (default) | owner only | no |
| `unlisted` | anyone with the link, signed in or not | no |
| `public` | anyone, signed in or not | yes |

"sharing" in earlier discussion corresponds to `public`.

Security design (see [../product/farms-and-feed.md](../product/farms-and-feed.md)):

- The table's read policy allows only `public` rows and the owner's own rows. If it also allowed `unlisted`, anyone could list all unlisted farms through the REST API, defeating link-only sharing.
- A single farm is fetched by id through a `security definer` Postgres function that returns the farm only if it is `unlisted` or `public`. It cannot be used to enumerate farms.
- Farm ids are random UUIDs, never sequential numbers.

## Alternatives considered

- **Two levels (private, public):** simplest and fastest, but anyone sharing a link to a friend would also publish to the feed, so many users would avoid sharing.

## Consequences

- Store `privacy` as text with a check constraint (or enum), not a boolean. New farms default to `private` (accidental publication is the failure mode to avoid).
- The privacy selector must be explicit: for example "Public (appears in the global feed)" and "Unlisted (anyone with the link can view)".
- Unlisted pages should send `noindex`; as an SPA this is set client-side, which compliant crawlers respect but does not guarantee. Unlisted farm content is not sensitive; the UI should say "anyone with the link can view".
- Switching a farm to `private` takes effect immediately for new requests, but anyone who already has the link may have a cached copy.
- Shared farms carry user-written text seen by strangers: a minimal report/hide path is needed (roadmap Phase 5), not full moderation tooling.
