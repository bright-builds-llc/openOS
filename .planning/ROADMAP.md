# Roadmap: openOS

## Milestones

- ✅ **v1 iPhone Web App Foundation** — Phases 1-8, shipped 2026-04-05. Archive: [.planning/milestones/v1-ROADMAP.md](./milestones/v1-ROADMAP.md)
- 🚧 **v1.1 Core Apps & Platform Foundations** — Phases 9-14, planned

## Overview

`v1.1` grows openOS from a shell-and-Calculator proof into the first believable multi-app system. The order follows the dependency chain:

1. Home-screen pagination must exist before additional built-in apps can feel spatially coherent.
2. Internal app-platform primitives should be established before multiple new apps depend on them.
3. `Settings` should land first as the user-visible control plane for openOS preferences and internal app/platform management.
4. `Notes` builds on local persistence and platform conventions without introducing backend sync.
5. `Browser` comes after that with a managed-iframe model and explicit blocked-embed fallback.
6. Final verification then locks the new page, app, and platform flows together.

## Phase Summary

| Phase | Name | Goal | Requirements | Success Criteria |
|-------|------|------|--------------|------------------|
| 9 | Home Screen Pages | Add multi-page home-screen behavior that preserves launcher fidelity and page-return semantics | HOME-05, HOME-06, HOME-07 | 4 |
| 10 | App Platform Primitives | Introduce the first reusable internal app-platform layer for page placement, settings participation, and storage conventions | PLAT-01, PLAT-02 | 4 |
| 11 | Settings App | Deliver the first openOS-native control plane for preferences and internal app/platform management | SETT-01, SETT-02, SETT-03, SETT-04 | 5 |
| 12 | Notes App | Deliver local-only notes with clear persistence boundaries and honest no-sync messaging | NOTE-01, NOTE-02, NOTE-03, NOTE-04 | 5 |
| 13 | Managed Browser App | Deliver a truthful, limited browser surface for curated/embed-safe destinations with graceful fallback | BROW-01, BROW-02, BROW-03, BROW-04 | 5 |
| 14 | Verification and App Integration | Prove the new page/app/platform flows together and lock the milestone quality bar | PLAT-03, QUAL-03, QUAL-04 | 4 |

## Active Phases

### Phase 9: Home Screen Pages

**Goal:** Add multiple home-screen pages without weakening the current shell illusion or launch/return behavior.

**Status:** Complete (verified 2026-04-06)

**Requirements:** HOME-05, HOME-06, HOME-07

**Why first:**
- Additional built-in apps need believable spatial placement rather than a single overcrowded page.
- Page-return semantics must be part of the launcher/runtime model before the next apps deepen integration.
- This phase protects the shell illusion from turning into an arbitrary tabbed surface.

**Success criteria:**
1. Users can navigate between at least two home-screen pages in portrait mode.
2. The shell clearly indicates which home-screen page is active.
3. Returning home from an app lands back on the page the app launched from.
4. Page behavior remains visually consistent with the existing dock, wallpaper, and shell rhythm.

### Phase 10: App Platform Primitives

**Goal:** Introduce the first reusable internal app-platform layer for page placement, settings participation, and storage conventions.

**Status:** Complete (verified 2026-04-06)

**Requirements:** PLAT-01, PLAT-02

**Why second:**
- `Settings`, `Notes`, and `Browser` should all consume one platform shape instead of each inventing their own wiring.
- The next apps need a common contract for placement, settings, and storage participation.
- This is the narrowest useful platform slice before public app distribution or plugin surfaces.

**Success criteria:**
1. Developers can define built-in app metadata through shared platform primitives instead of ad hoc shell wiring.
2. Apps can declare page placement, settings participation, and storage namespace through that shared layer.
3. The platform layer is actively consumed by the next app phases rather than existing as dead abstraction.
4. The platform work stays internal-first and does not balloon into public app distribution scope.

### Phase 11: Settings App

**Goal:** Deliver `Settings` as the first openOS-native control plane for preferences and internal app/platform management.

**Status:** Complete (verified 2026-04-06)

**Requirements:** SETT-01, SETT-02, SETT-03, SETT-04

**Why third:**
- `Settings` is the natural first consumer of the new platform primitives.
- Preference management should be in place before `Notes` and `Browser` deepen user-facing system behavior.
- It provides the first user-visible platform/app management surface without requiring a public marketplace yet.

**Success criteria:**
1. Users can open `Settings` from the home screen as a real implemented app.
2. Users can change core openOS preferences and see them apply.
3. Settings persist locally across relaunches.
4. `Settings` exposes a first internal app/platform management surface driven by shared app metadata.
5. The app feels native to openOS rather than like an arbitrary web settings page.

### Phase 12: Notes App

**Goal:** Deliver locally persisted `Notes` with clear local-only/no-sync messaging and a believable app flow.

**Status:** Complete (verified 2026-04-07)

**Requirements:** NOTE-01, NOTE-02, NOTE-03, NOTE-04

**Why fourth:**
- `Notes` validates real local persistence and storage conventions on top of the new platform layer.
- It adds meaningful app depth without forcing cloud/sync scope into this milestone.
- Honest local-only messaging helps establish openOS trust rather than overpromising.

**Success criteria:**
1. Users can open `Notes` as a real implemented app.
2. Users can create, edit, and delete notes.
3. Saved notes can be reopened from a notes list and persist locally across relaunches.
4. Users see clear local-only/no-sync messaging.
5. The `Notes` experience feels coherent inside the existing shell/runtime path.

### Phase 13: Managed Browser App

**Goal:** Deliver a truthful, limited `Browser` app for curated/embed-safe destinations with graceful blocked-embed fallback.

**Status:** Complete (verified 2026-04-07)

**Requirements:** BROW-01, BROW-02, BROW-03, BROW-04

**Why fifth:**
- The Browser app depends on the new page model and platform conventions already existing.
- It is the most externally constrained app in the milestone because embedding can be blocked by site policy.
- Shipping it late keeps the milestone honest about browser limitations while still delivering visible breadth.

**Success criteria:**
1. Users can open `Browser` as a real implemented app.
2. Users can navigate a curated set of destinations inside a managed iframe surface.
3. Blocked destinations show a graceful fallback with external-open affordance.
4. The app remains truthful about what can and cannot be embedded.
5. The Browser app fits the existing runtime/motion shell without destabilizing it.

### Phase 14: Verification and App Integration

**Goal:** Prove the new page/app/platform flows together and lock the milestone quality bar.

**Status:** Complete (verified 2026-04-07)

**Requirements:** PLAT-03, QUAL-03, QUAL-04

**Why sixth:**
- Once pages, platform primitives, and new apps exist, cross-app verification becomes high-value instead of speculative.
- This phase ensures the new platform layer is truly shared rather than merely present.
- It closes the loop on the milestone without reopening broad product scope.

**Success criteria:**
1. Automated browser tests verify multi-page home navigation and launch/return behavior for `Settings`, `Notes`, and `Browser`.
2. Automated tests verify Notes local persistence/local-only messaging and Browser blocked-embed fallback at a basic level.
3. Shared platform primitives are actively used by `Settings`, `Notes`, and `Browser`.
4. The new app/platform flows feel integrated rather than like isolated feature islands.

## Requirement Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-05 | Phase 9 | Pending |
| HOME-06 | Phase 9 | Pending |
| HOME-07 | Phase 9 | Pending |
| PLAT-01 | Phase 10 | Pending |
| PLAT-02 | Phase 10 | Pending |
| SETT-01 | Phase 11 | Pending |
| SETT-02 | Phase 11 | Pending |
| SETT-03 | Phase 11 | Pending |
| SETT-04 | Phase 11 | Pending |
| NOTE-01 | Phase 12 | Pending |
| NOTE-02 | Phase 12 | Pending |
| NOTE-03 | Phase 12 | Pending |
| NOTE-04 | Phase 12 | Pending |
| BROW-01 | Phase 13 | Pending |
| BROW-02 | Phase 13 | Pending |
| BROW-03 | Phase 13 | Pending |
| BROW-04 | Phase 13 | Pending |
| PLAT-03 | Phase 14 | Pending |
| QUAL-03 | Phase 14 | Pending |
| QUAL-04 | Phase 14 | Pending |

**Coverage:**
- v1.1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Roadmap updated: 2026-04-06 for v1.1 milestone initialization*
*Phase 13 completed: 2026-04-07*
*Phase 12 completed: 2026-04-07*
*Phase 11 completed: 2026-04-06*
*Phase 9 completed: 2026-04-06*
*Phase 10 completed: 2026-04-06*
*Phase 14 completed: 2026-04-07*
