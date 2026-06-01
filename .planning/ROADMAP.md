# Roadmap: openOS

## Overview

`v1.3 Stateful Apps & Platform Maturity` deepens local app state without expanding into sync, arbitrary install, Safari-parity claims, or a new global state manager. The milestone starts by making app-session state safe and verifiable, then moves through Notes structure, Notes resume, Browser tabs, submitted-app metadata hardening, and final cross-app state polish.

## Milestones

- ✅ **v1 iPhone Web App Foundation** - Phases 1-8, shipped 2026-04-05. Archive: [.planning/milestones/v1-ROADMAP.md](./milestones/v1-ROADMAP.md)
- ✅ **v1.1 Core Apps & Platform Foundations** - Phases 9-15, shipped 2026-04-09. Archive: [.planning/milestones/v1.1-ROADMAP.md](./milestones/v1.1-ROADMAP.md)
- ✅ **v1.2 Notes, Browser & Platform Growth** - Phases 16-22, shipped 2026-04-11. Archive: [.planning/milestones/v1.2-ROADMAP.md](./milestones/v1.2-ROADMAP.md)
- 🚧 **v1.3 Stateful Apps & Platform Maturity** - Phases 23-28, in progress

## Phases

**Phase Numbering:**
- Integer phases (23, 24, 25): Planned milestone work continuing after `v1.2`
- Decimal phases (23.1, 23.2): Urgent insertions, if needed later

- [x] **Phase 23: State Contracts And Verification Baseline** - Make app-session state safe, recoverable, and distinct from durable user data. (completed 2026-05-27)
- [x] **Phase 24: Notes Structured Model And Migration** - Move Notes to a structured local model while preserving existing notes and search. (completed 2026-05-28)
- [x] **Phase 25: Notes Editor And Resume** - Let users edit structured notes and resume meaningful Notes context. (completed 2026-06-01)
- [ ] **Phase 26: Browser Tabs And Session Restore** - Add truthful multi-tab Browser state shared across launcher entry points.
- [ ] **Phase 27: Submitted Metadata Workflow Hardening** - Keep submitted app validation, generated registry output, and Library catalog metadata aligned.
- [ ] **Phase 28: Core App-State Polish And Integrated Regression** - Extend resume behavior to core built-in apps and finalize `verify:v1.3`.

## Phase Details

### Phase 23: State Contracts And Verification Baseline
**Goal**: Users can rely on app-session state failing safely without putting durable local data at risk.
**Depends on**: Phase 22
**Requirements**: STATE-02, STATE-03, STATE-04
**Success Criteria** (what must be TRUE):
  1. User-authored durable data remains intact when disposable app-session state is reset or cleared.
  2. User can recover from malformed saved app-session state without losing notes or reviewed catalog data.
  3. User sees truthful unavailable or reset behavior when local storage cannot preserve app-session state.
**Plans**: 2 plans
Plans:
- [x] 23-01-PLAN.md - Platform app-session storage contract and canonical namespace tests
- [x] 23-02-PLAN.md - Durable Notes isolation regression and `verify:v1.3` wiring

### Phase 24: Notes Structured Model And Migration
**Goal**: Existing Notes data safely moves to a structured local model that remains searchable and previewable.
**Depends on**: Phase 23
**Requirements**: NOTES-01, NOTES-04
**Success Criteria** (what must be TRUE):
  1. User's existing v1.2 notes migrate with title, body, folder, timestamps, and searchability preserved.
  2. User can search structured note content, including formatted or checklist text, and see useful previews generated from that content.
  3. User can keep browsing existing folders after migration without notes dropping out of the local collection.
**Plans**: 3 plans
Plans:
- [x] 24-01-PLAN.md - Structured Notes content model and search/preview helpers
- [x] 24-02-PLAN.md - Durable Notes version 3 migration and storage safety
- [x] 24-03-PLAN.md - Plain-text app adapter and `verify:v1.3` coverage

### Phase 25: Notes Editor And Resume
**Goal**: Users can create structured local notes and return to the Notes editor screen without losing meaningful context.
**Depends on**: Phase 24
**Requirements**: NOTES-02, NOTES-03, NOTES-05
**Success Criteria** (what must be TRUE):
  1. User can create and edit local notes with headings or sections.
  2. User can create and update checklist or list content inside a local note.
  3. User can return to Notes and resume the last meaningful folder, note, and edit context after navigating home or reloading.
**Plans**: 3 plans
Plans:
- [x] 25-01-PLAN.md - Structured Notes content, storage, and session contracts
- [x] 25-02-PLAN.md - Notes structured editor and resume UI wiring
- [x] 25-03-PLAN.md - Browser resume coverage and `verify:v1.3` gate
**UI hint**: yes

### Phase 26: Browser Tabs And Session Restore
**Goal**: Users can manage a truthful Browser tab view that restores recent local session context.
**Depends on**: Phase 25
**Requirements**: BROWSER-01, BROWSER-02, BROWSER-03, BROWSER-04, BROWSER-05, BROWSER-06
**Success Criteria** (what must be TRUE):
  1. User can keep multiple Browser tabs with independent destinations.
  2. User can leave Browser, reopen it from either launcher, or reload and recover the same active tab session.
  3. User can distinguish per-tab embedded destinations from destinations that must open externally.
  4. User can recover recently closed Browser tabs within a bounded local session.
  5. User can reset corrupt Browser session state without losing the canonical Browser launcher identity.
**Plans**: TBD
**UI hint**: yes

### Phase 27: Submitted Metadata Workflow Hardening
**Goal**: Contributors and maintainers can trust one reviewed submitted-app metadata path from manifest validation to the Library catalog view.
**Depends on**: Phase 26
**Requirements**: PLATFORM-01, PLATFORM-02, PLATFORM-03, PLATFORM-04, PLATFORM-05, PLATFORM-06
**Success Criteria** (what must be TRUE):
  1. Contributor can add or update a submitted app manifest without editing a second hand-maintained registry.
  2. Contributor gets field-specific validation errors and can distinguish draft manifests from catalog-ready manifests.
  3. User sees Library catalog entries generated from the same reviewed metadata validated by the submission workflow.
  4. Maintainer can detect duplicate, missing, or stale submitted-app registry output before merge.
  5. Contributor can preview or inspect the Library-facing submitted-app metadata before review.
**Plans**: TBD
**UI hint**: yes

### Phase 28: Core App-State Polish And Integrated Regression
**Goal**: Users can return to core built-in app screens and resume meaningful local context, with milestone verification covering the contract end to end.
**Depends on**: Phase 27
**Requirements**: STATE-01, STATE-05
**Success Criteria** (what must be TRUE):
  1. User can leave and reopen core built-in apps without losing meaningful local UI context.
  2. User can return to Library and Calculator without losing appropriate non-destructive context or being misled when state resets.
  3. User can move through Home, dock launches, grid launches, Notes, Browser, Library, and Calculator without built-in apps feeling like fresh launches every time.
  4. Maintainer can verify the shared v1.3 app-state contract through one canonical `verify:v1.3` command.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 23 -> 24 -> 25 -> 26 -> 27 -> 28

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 23. State Contracts And Verification Baseline | v1.3 | 2/2 | Complete    | 2026-05-27 |
| 24. Notes Structured Model And Migration | v1.3 | 3/3 | Complete    | 2026-05-28 |
| 25. Notes Editor And Resume | v1.3 | 3/3 | Complete   | 2026-06-01 |
| 26. Browser Tabs And Session Restore | v1.3 | 0/TBD | Not started | - |
| 27. Submitted Metadata Workflow Hardening | v1.3 | 0/TBD | Not started | - |
| 28. Core App-State Polish And Integrated Regression | v1.3 | 0/TBD | Not started | - |

## Coverage

All 22 `v1.3` requirements map to exactly one phase.

---
*Roadmap created for v1.3 on 2026-05-27*
