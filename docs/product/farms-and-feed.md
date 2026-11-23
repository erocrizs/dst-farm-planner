# Farms, privacy and the global feed

Status: adopted spec (2026-11-23). Names, limits and SQL below are a sketch for implementers; where a value is marked *proposal* it is not final.

## Product behavior

- **Accounts.** Users sign in with Discord or Google ([0003](../decisions/0003-auth-oauth-discord-google.md)). Farms are saved to the database and tied to the signed-in user. Signed-out users can still use the planner locally (behavior of the current app).
- **Farms.** Each farm has a name and an optional short description. Each farm has its own URL: `/farms/:id` (`id` is a random UUID).
- **Privacy** ([0004](../decisions/0004-privacy-levels.md)): `private` (default), `unlisted` (anyone with the link, not in the feed), `public` (anyone with the link and listed in the feed). Non-owners, signed in or not, see a read-only view of an `unlisted` or `public` farm.
- **Global feed.** Lists `public` farms only. Each entry shows name, short description (if any), author username and a yield summary. Newest first. Filters: one season and a minimum yield for any of the 14 crops, all combined with AND ([0005](../decisions/0005-yield-columns-and-feed-filter.md)). Example: season = summer, Toma Root >= 18, Dragon Fruit >= 5.
- **Yield** is the planner's "optimal yield" (`FarmData.optimalYield`), labeled as such in the UI. Only crop counts are stored.

## Database sketch

Managed as SQL migrations with the Supabase CLI.

```
profiles
  id          uuid primary key references auth.users on delete cascade
  username    text not null unique      -- seeded from the provider name, user-editable
  created_at  timestamptz not null default now()

farms
  id          uuid primary key default gen_random_uuid()
  owner_id    uuid not null references auth.users on delete cascade
  name        text not null             -- length limit: proposal 60
  description text                      -- optional, length limit: proposal 280
  privacy     text not null default 'private'
                check (privacy in ('private','unlisted','public'))
  season      text not null check (season in ('autumn','winter','spring','summer'))
  data        jsonb not null            -- FarmData.toJSON(): { width, height, season, tiles }
  <one integer column per crop, see below>
  created_at  timestamptz not null default now()
  updated_at  timestamptz not null default now()
```

### Crop column mapping

Keys are the keys of `farm-planner/src/library/crops.js`. Each column is `integer not null default 0 check (>= 0)`.

| `crops.js` key | Column |
|---|---|
| carrot | `carrot` |
| corn | `corn` |
| potato | `potato` |
| tomaRoot | `toma_root` |
| asparagus | `asparagus` |
| eggplant | `eggplant` |
| pumpkin | `pumpkin` |
| watermelon | `watermelon` |
| dragonFruit | `dragon_fruit` |
| durian | `durian` |
| garlic | `garlic` |
| onion | `onion` |
| pepper | `pepper` |
| pomegranate | `pomegranate` |

Keep the mapping in one module and add a test that every key in `crops.js` has a column and vice versa. Do not rename a crop key without a migration.

### Indexes

Start with: a partial index on `(season, created_at desc)` where `privacy = 'public'` (feed and pagination), and an index on `owner_id` ("my farms"). Add per-crop indexes only if queries become slow.

## Security design

Privacy is enforced in the database, not in the client. A mistake in these policies is a data leak.

**`farms` (Row Level Security on):**

- `select`: allowed when `owner_id = auth.uid()` or `privacy = 'public'`. **Not** for `unlisted` rows, or anyone could list all unlisted farms through the REST API.
- `insert` / `update` / `delete`: only when `owner_id = auth.uid()` (with a matching `with check` so an owner cannot reassign a farm).

**Fetching one farm by id** (`/farms/:id`, including `unlisted`): a Postgres function, for example `get_farm(farm_id uuid)`, declared `security definer` with a fixed `search_path`. It returns the farm (and the author's username) only if `privacy in ('unlisted','public')`. It takes one id and returns at most one row, so it cannot enumerate farms. The owner reads their own farms, including private ones, through the table.

**`profiles`:** readable by everyone for `id` and `username` only; no email or provider data in this table. Writable only by the owner. A database trigger creates the row on first login.

**Feed query:** joins `farms` (public only) and `profiles` for the username. List columns explicitly: id, name, description, season, the 14 yield columns, owner username, created_at. Never `select *` (the row carries the full tile `data`). Use keyset pagination (by `created_at`, `id`), not offset.

**Tests required:** Row Level Security and function tests covering at least: anonymous cannot read a `private` or `unlisted` row through the table; anonymous can read a `public` row; anyone can fetch an `unlisted` farm by id through the function; nobody can enumerate `unlisted` farms; a non-owner cannot insert, update or delete someone else's farm; an owner cannot change `owner_id`.

**Client rules:** never `v-html` on farm names, descriptions or usernames; never ship the service-role key; the Supabase URL and anon key are public by design.

## Save path

A single client function writes `data` and the 14 yield columns in the same call (columns computed from `FarmData.optimalYield`, crop counts only). Do not write them separately. If they drift, `data` is the source of truth and the columns can be recomputed. Yield columns are client-supplied and can be inflated; this is accepted for launch ([0005](../decisions/0005-yield-columns-and-feed-filter.md)).

## Open product items

- Exact length limits for name and description (proposals above).
- The report/hide path for public farms (minimum: a user can report a farm; the owner can hide it by setting it private; an admin path can be a manual database action at first).
- Whether the existing `localStorage` save format (keys `saveSummaries` and `saveData`) carries a farm name; check before building the import in roadmap Phase 6.
- Preferred seasons in `crops.js` have not been verified against the wiki (colour-coded there).
