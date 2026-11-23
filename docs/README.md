# Docs

All project documentation lives here: plans, product specs and decision records. Agents should check this directory for context before starting work.

## Index

- [plans/roadmap.md](plans/roadmap.md): phased plan from the current local-only app to a hosted product with accounts, shareable farms and a global feed. Task breakdown, dependencies, owner-only prerequisites and open items (adopted plan; individual items marked as open where undecided).
- [product/farms-and-feed.md](product/farms-and-feed.md): product and data spec for farms, privacy levels, URLs, the database schema sketch, the security design and the global feed filter (adopted).
- [decisions/README.md](decisions/README.md): decision records (ADRs): process, template and one record per confirmed decision.

## Conventions

- `CLAUDE.md` (repo root) holds only **finalized** decisions.
- Anything proposed, undecided or exploratory belongs in `docs/` with its status marked clearly (adopted, proposed, open).
- When a decision is finalized, record it in `CLAUDE.md` and in a decision record (`decisions/NNNN-title.md`), and update the status in the document where it was discussed.
- Add every new document to the index above.
- Decision records are append-only history: to change a decision, add a new record that supersedes the old one and update the old one's status.
