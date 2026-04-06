# Requirements: openOS

**Defined:** 2026-04-06
**Core Value:** When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## v1.1 Requirements

### Home Screen

- [ ] **HOME-05**: User can navigate between multiple home-screen pages in portrait mode.
- [ ] **HOME-06**: User returning home from an app lands back on the same home-screen page they launched from.
- [ ] **HOME-07**: User can visually understand which home-screen page is active through iPhone-like page indicators.

### Settings

- [ ] **SETT-01**: User can open `Settings` from the home screen as a real implemented app.
- [ ] **SETT-02**: User can change core openOS preferences in `Settings` and see them apply to the experience.
- [ ] **SETT-03**: User’s openOS settings persist locally across relaunches.
- [ ] **SETT-04**: User can access a first internal app/platform management surface from `Settings`, driven by shared app metadata.

### Notes

- [ ] **NOTE-01**: User can open `Notes` from the home screen as a real implemented app.
- [ ] **NOTE-02**: User can create, edit, and delete notes.
- [ ] **NOTE-03**: User can reopen previously saved notes from a notes list, and those notes persist locally across relaunches.
- [ ] **NOTE-04**: User sees clear local-only / no-sync messaging in `Notes`.

### Browser

- [ ] **BROW-01**: User can open `Browser` from the home screen as a real implemented app.
- [ ] **BROW-02**: User can load curated/embed-safe destinations inside a managed iframe browser surface.
- [ ] **BROW-03**: User sees a graceful blocked-embed state with an option to open externally when a destination cannot be embedded.
- [ ] **BROW-04**: User can navigate among a small curated set of browser destinations from within the app.

### Platform

- [ ] **PLAT-01**: Developers can define built-in app metadata through reusable platform primitives instead of ad hoc shell wiring.
- [ ] **PLAT-02**: Apps can declare page placement, settings participation, and storage namespace through shared platform primitives.
- [ ] **PLAT-03**: Shared platform primitives are actively used by `Settings`, `Notes`, and `Browser` rather than existing as unused abstractions.

### Verification

- [ ] **QUAL-03**: Automated browser UI tests verify multi-page home navigation and launch/return behavior for `Settings`, `Notes`, and `Browser`.
- [ ] **QUAL-04**: Automated tests verify Notes local persistence/local-only messaging and Browser blocked-embed fallback at a basic level.

## v2 Requirements

### Notes Expansion

- **NOTE-05**: User can search notes.
- **NOTE-06**: User can organize notes into folders or tags.
- **NOTE-07**: User can sync notes across devices/accounts.
- **NOTE-08**: User can edit notes with richer formatting than plain text.

### Browser Expansion

- **BROW-05**: User can browse arbitrary sites rather than a curated/embed-safe set only.
- **BROW-06**: User can enter arbitrary URLs directly.
- **BROW-07**: User can use multiple browser tabs.

### Platform Growth

- **PLAT-04**: Contributors can submit apps through a repo-driven review workflow.
- **PLAT-05**: User can browse apps in an in-product app catalog.
- **PLAT-06**: User can install arbitrary virtual apps through an escape-hatch flow.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real general-purpose web browser behavior | Arbitrary sites are often blocked from iframe embedding; `v1.1` Browser should stay limited and truthful |
| Notes sync/accounts | Adds backend and data-consistency scope before local Notes workflow is proven |
| Rich-text notes editor | Increases editor complexity before plain local note flow is validated |
| Public app marketplace or app submission UI | Platform primitives should stay internal-first in `v1.1` |
| Landscape home/app support | Still outside the current product fidelity target |

## Traceability

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
*Requirements defined: 2026-04-06*
*Last updated: 2026-04-06 after v1.1 initial definition*
