# Roadmap: openOS

## Milestones

- ✅ **v1 iPhone Web App Foundation** — Phases 1-8, shipped 2026-04-05. Archive: [.planning/milestones/v1-ROADMAP.md](./milestones/v1-ROADMAP.md)
- ✅ **v1.1 Core Apps & Platform Foundations** — Phases 9-15, shipped 2026-04-09. Archive: [.planning/milestones/v1.1-ROADMAP.md](./milestones/v1.1-ROADMAP.md)
- 🚧 **v1.2 Notes, Browser & Platform Growth** — Phases 16-20, planned

## Overview

`v1.2` grows openOS along the three strongest seams validated in `v1.1`:

1. `Notes` becomes more useful through local search and organization.
2. `Browser` becomes more capable through direct URL entry and broader destination handling, while staying truthful about embed limits.
3. The internal app-platform layer starts turning into a contributor-facing distribution surface through submission and catalog foundations.
4. Final verification locks the new user flows and platform seams together before any larger sync or install scope is attempted.

## Phase Summary

| Phase | Name | Goal | Requirements | Success Criteria |
|-------|------|------|--------------|------------------|
| 16 | Notes Search and Organization | Make `Notes` useful beyond a flat local notebook by adding search and durable organization | NOTE-05, NOTE-06 | 4 |
| 17 | Browser Direct Navigation | Let `Browser` accept direct URLs and broaden destination handling while keeping fallback behavior honest | BROW-05, BROW-06 | 4 |
| 18 | App Submission Foundations | Introduce the first repo-driven app submission workflow on top of the shared openOS app-platform layer | PLAT-04 | 4 |
| 19 | App Catalog | Expose the first in-product app catalog surface from shared submission metadata | PLAT-05 | 4 |
| 20 | Verification and Distribution Integration | 3/3 | Complete    | 2026-04-11 |

## Active Phases

### Phase 16: Notes Search and Organization

**Goal:** Make `Notes` useful beyond a flat local notebook by adding search and durable organization.

**Status:** Complete

**Requirements:** NOTE-05, NOTE-06

**Why first:**
- `Notes` already has a local repository layer and app runtime path, so search and organization build on proven seams.
- This is the highest user-value follow-up to the local-only Notes app from `v1.1`.
- Keeping it local-first avoids dragging sync/accounts into the first expansion step.

**Success criteria:**
1. Users can search notes by title and body text.
2. Users can organize notes into folders or tags.
3. Users can browse or filter notes through that folder/tag structure.
4. Search and organization state persist locally across relaunches.

### Phase 17: Browser Direct Navigation

**Goal:** Let `Browser` accept direct URLs and broaden destination handling while keeping fallback behavior honest.

**Status:** Complete

**Requirements:** BROW-05, BROW-06

**Why second:**
- The Browser app already has a truthful embedded/fallback model, so direct navigation can extend that model instead of replacing it.
- URL entry is the clearest next capability step after the curated `v1.1` Browser.
- This phase can stay product-truthful without committing to Safari parity or tabs.

**Success criteria:**
1. Users can enter arbitrary URLs directly in Browser.
2. Browser can navigate beyond the original curated destination list.
3. Destinations that cannot be embedded still surface a clear external fallback.
4. The expanded Browser still feels coherent inside the existing launcher/runtime path.

### Phase 18: App Submission Foundations

**Goal:** Introduce the first repo-driven app submission workflow on top of the shared openOS app-platform layer.

**Status:** Complete

**Requirements:** PLAT-04

**Why third:**
- Submission should land before catalog browsing so the catalog has a real data source.
- The shared app-platform metadata from `v1.1` is now strong enough to support a contributor-facing contract.
- This phase lays groundwork without overcommitting to arbitrary installation yet.

**Success criteria:**
1. Contributors can define submitted apps through a repo-driven manifest or metadata contract.
2. The submission workflow validates required metadata before an app is considered catalog-ready.
3. Submission metadata aligns with the existing runtime/app-definition contract.
4. The first sample submission path is documented and testable.

### Phase 19: App Catalog

**Goal:** Expose the first in-product app catalog surface from shared submission metadata.

**Status:** Complete

**Requirements:** PLAT-05

**Why fourth:**
- The catalog depends on submission metadata and should not invent a separate source of truth.
- It creates the first user-facing expression of the platform/distribution work without yet handling arbitrary install flows.
- This phase keeps the platform growth visible while staying within a narrow browsing-only scope.

**Success criteria:**
1. Users can open and browse an in-product app catalog.
2. Catalog entries are driven by the shared submission metadata source.
3. Users can inspect meaningful app information from within the catalog.
4. The catalog stays honest about what is browseable now versus installable later.

### Phase 20: Verification and Distribution Integration

**Goal:** Prove the new Notes, Browser, and platform distribution flows work together cleanly.

**Status:** Complete

**Requirements:** QUAL-05, QUAL-06

**Why fifth:**
- The new milestone spans multiple app and platform seams, so final integration verification is high-value.
- Verification should prove the expanded behaviors on the real launcher/runtime path before any larger milestone is started.
- This keeps the milestone honest in the same way Phase 14 and Phase 15 did for `v1.1`.

**Success criteria:**
1. Automated tests verify Notes search and organization behavior at a basic level.
2. Automated tests verify Browser direct-URL entry and truthful fallback behavior at a basic level.
3. Automated tests verify the repo-driven app submission flow and in-product catalog browsing at a basic level.
4. The final verification set passes without reopening major truthfulness or integration gaps.

## Requirement Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| NOTE-05 | Phase 16 | Complete |
| NOTE-06 | Phase 16 | Complete |
| BROW-05 | Phase 17 | Complete |
| BROW-06 | Phase 17 | Complete |
| PLAT-04 | Phase 18 | Complete |
| PLAT-05 | Phase 19 | Complete |
| QUAL-05 | Phase 20 | Complete |
| QUAL-06 | Phase 20 | Complete |

**Coverage:**
- v1.2 requirements: 8 total
- Mapped to phases: 8
- Unmapped: 0

---
*Roadmap updated: 2026-04-11 after completing Phase 20*
