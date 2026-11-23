# 0002: Hosting: Cloudflare Pages

- Status: Accepted
- Date: 2026-11-23
- Deciders: owner

## Context

The app is a static single-page app. Per-farm URLs (`/farms/:id`) mean the host must serve `index.html` for unknown paths. Constraints: free hosting, fast launch.

## Decision

Host on Cloudflare Pages (free plan), starting on the free `*.pages.dev` address. A custom domain can be added later.

Note: Cloudflare has been steering new projects toward "Workers with static assets". Pages is still supported; at setup time, check Cloudflare's current guidance and pick whichever is the recommended free static hosting, keeping the same SPA-fallback behavior.

## Alternatives considered

- **Vercel:** easiest setup and PR preview deploys, but the free Hobby plan is non-commercial only and has bandwidth limits.
- **Netlify:** similar to Vercel, free-tier credit limits.

## Consequences

- Production builds currently use `publicPath: '/dst-farm-planner/'` in `farm-planner/vue.config.js` (a subpath deployment). Cloudflare serves from the root, so `publicPath` must become `/` (or be made configurable). This is a necessary change, not a refactor.
- Deep links need SPA fallback so `/farms/:id` serves the app. Verify this on the first deploy.
- PR preview deployments run on separate origins. Supabase auth redirect URLs and OAuth providers must allow them (wildcard allowlist), or previews will not be able to sign in.
- Link previews (Open Graph cards for shared farm URLs) will not work with a pure SPA. Accepted for now.
