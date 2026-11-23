# 0005: Yield stored as one column per crop; feed filters on season and per-crop minimums

- Status: Accepted
- Date: 2026-11-23
- Deciders: owner

## Context

The global feed shows a yield summary per farm and filters by yield and season. Players think in terms of specific crops ("a summer farm with at least 18 Toma Root and 5 Dragon Fruit"), so a single "total crops" number is not useful enough. The app computes yield per crop in the browser (`FarmData.optimalYield` returns `{crop, seed}` counts per crop).

## Decision

- Store **crop yield only** (no seed counts) as **one integer column per crop** on the `farms` table, next to the full tile `data` (jsonb). There are 14 crops. The column mapping is in [../product/farms-and-feed.md](../product/farms-and-feed.md).
- The feed filter is one **season** (exact match; a farm has a single season setting) plus **minimum** yield for any of the 14 crops, all combined with AND. No maximum filter.
- Columns are `integer not null default 0 check (>= 0)`, so a missing value never silently drops a farm from a `>=` filter.

The set of crops was checked against the Don't Starve wiki (https://dontstarve.wiki.gg/wiki/Farming/DST, page edited 2026-09-23): 14 crops in both the wiki and `crops.js`; formula, compost, manure and drink values match for all 14. Preferred seasons in `crops.js` could not be verified from the page text (the wiki marks them with colour). The owner does not expect new crops; if one is added, it needs a migration (new column), a `crops.js` entry and a mapping entry.

## Alternatives considered

- **Single "minimum total crops" number:** trivial but not useful for players targeting specific crops.
- **`jsonb` summary column:** flexible, but a GIN index does not help numeric `>=` comparisons, filtering through the REST API on nested jsonb numbers is awkward, and a search function would be needed to validate input.
- **Separate `farm_yields` table (one row per farm and crop):** scales best, but adds a second table with its own Row Level Security policies for no launch benefit.

## Consequences

- Plain integer columns get normal btree indexes and work with plain REST filters; the schema itself is the allowlist of crop names. Start with a partial index on season for public farms and one on creation time for pagination; add per-crop indexes only if queries become slow.
- The 14 columns are derived from `data`. They must be written in the same save call as `data`, through a single client function with a test. If they ever drift, `data` is the source of truth and the columns can be recomputed.
- Crop keys in `crops.js` are camelCase (`tomaRoot`, `dragonFruit`); columns are snake_case. One mapping lives in one place, with a test that every key in `crops.js` has a column.
- The feed query must list columns explicitly, never `select *`, so it does not download each farm's tile data.
- Yield is the planner's "optimal yield", not an in-game guarantee; the UI should label it that way.
- Yield columns come from the client at save time, so a user could inflate them to rank in a filter. The damage is cosmetic and accepted for launch; a server-side recompute can be added later.
