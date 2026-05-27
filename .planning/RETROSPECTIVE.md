# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.2 — Notes, Browser & Platform Growth

**Shipped:** 2026-04-11  
**Phases:** 7 | **Plans:** 20 | **Sessions:** not tracked in repo artifacts

### What Was Built

- Local-first Notes gained search, folders, migration, and real launcher-path verification.
- Browser gained truthful direct URL entry, broader destination handling, and explicit shared launcher identity across grid and dock.
- The project gained a repo-driven submitted-app manifest contract, fail-closed validator drift detection, and the first in-product `Library` app catalog.

### What Worked

- Keeping the milestone narrow around proven seams let Notes, Browser, and platform work build on shared runtime primitives instead of reinventing them.
- The canonical `bun run verify:v1.2` gate created one reliable closeout path across submissions, unit tests, typecheck, build, and launcher-path E2E coverage.

### What Was Inefficient

- Submitted-app registration still requires manual registry maintenance even though drift is now fail-closed.
- Browser’s dual launcher-entry model needed a late cleanup phase because the shared app identity was not made explicit early enough.

### Patterns Established

- Close milestone audit debt with narrow follow-up phases instead of reopening product scope.
- Keep repo-driven catalog/distribution features metadata-first and validation-first before adding broader install behavior.

### Key Lessons

1. Shared platform metadata should express canonical app identity explicitly before app-specific state grows around it.
2. Repo-native verification commands are worth adding as soon as a milestone spans multiple user-facing seams.

### Cost Observations

- Model mix: not directly recoverable from repo artifacts
- Sessions: not tracked in repo artifacts
- Notable: late hardening phases stayed cheap because earlier milestone work had kept seams explicit and testable

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.2 | not tracked | 7 | Added one canonical milestone verification command and used small debt-closure phases to finish the milestone cleanly |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.2 | `118` Vitest assertions + `19` WebKit E2E checks in `verify:v1.2` | Milestone-defining Notes, Browser, submission, and catalog flows are all covered | No new runtime dependencies added for milestone closeout hardening |

### Top Lessons (Verified Across Milestones)

1. Shared runtime/platform seams pay off when new app work and verification are layered on top instead of bypassing them.
2. Truthfulness constraints produce better scope decisions when they are treated as product requirements instead of polish concerns.
