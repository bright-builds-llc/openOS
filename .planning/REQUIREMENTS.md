# Requirements: openOS v1.3 Stateful Apps & Platform Maturity

**Defined:** 2026-05-27
**Core Value:** When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## v1.3 Requirements

Requirements for `v1.3 Stateful Apps & Platform Maturity`. Each maps to exactly one roadmap phase.

### State Contracts

- [ ] **STATE-01**: User can leave and reopen a core built-in app without losing meaningful local UI context.
- [x] **STATE-02**: User-authored durable data remains separate from disposable app-session state.
- [x] **STATE-03**: User can recover from malformed saved app-session state without losing notes or reviewed catalog data.
- [x] **STATE-04**: User sees truthful unavailable or reset behavior when local storage cannot preserve app-session state.
- [ ] **STATE-05**: Maintainers can verify the shared v1.3 app-state contract through one canonical `verify:v1.3` command.

### Notes

- [x] **NOTES-01**: User's existing v1.2 notes migrate to the v1.3 Notes model without losing title, body, folder, timestamps, or searchability.
- [ ] **NOTES-02**: User can create and edit structured local notes with headings or sections.
- [ ] **NOTES-03**: User can create and update checklist or list content inside a local note.
- [x] **NOTES-04**: User can search structured note content and see useful previews generated from formatted text.
- [ ] **NOTES-05**: User can return to Notes and resume the last meaningful folder, note, and edit context after navigating home or reloading.

### Browser

- [ ] **BROWSER-01**: User can keep multiple Browser tabs with independent destinations.
- [ ] **BROWSER-02**: User can restore the active Browser tab session after leaving Browser, reopening from either launcher, or reloading.
- [ ] **BROWSER-03**: User can distinguish per-tab embedded destinations from destinations that must open externally.
- [ ] **BROWSER-04**: User can recover recently closed Browser tabs within a bounded local session.
- [ ] **BROWSER-05**: User can reset corrupt Browser session state without losing the canonical Browser launcher identity.
- [ ] **BROWSER-06**: User opening Browser from grid or dock sees the same canonical tab session.

### Platform Submissions

- [ ] **PLATFORM-01**: Contributor can add or update a submitted app manifest without editing a second hand-maintained registry.
- [ ] **PLATFORM-02**: Contributor gets field-specific validation errors for invalid submitted app metadata.
- [ ] **PLATFORM-03**: Contributor can distinguish draft submitted manifests from catalog-ready manifests.
- [ ] **PLATFORM-04**: User sees Library catalog entries generated from the same reviewed metadata validated by the submission workflow.
- [ ] **PLATFORM-05**: Maintainer can detect duplicate, missing, or stale submitted-app registry output before merge.
- [ ] **PLATFORM-06**: Contributor can preview or inspect the Library-facing submitted-app metadata before review.

## Future Requirements

Deferred to a later milestone. Tracked but not in the current roadmap.

### Notes

- **NOTES-FUT-01**: User can sync notes across devices or accounts.
- **NOTES-FUT-02**: User can attach images, scans, or files to notes.
- **NOTES-FUT-03**: User can collaborate on shared notes.
- **NOTES-FUT-04**: User can lock or protect individual notes.

### Browser

- **BROWSER-FUT-01**: User can browse full persistent history across sessions.
- **BROWSER-FUT-02**: User can use private browsing, downloads, passwords, or extensions.
- **BROWSER-FUT-03**: User can browse arbitrary external sites in-app with Safari-like behavior.

### Platform

- **PLATFORM-FUT-01**: User can install arbitrary submitted virtual apps through an escape-hatch flow.
- **PLATFORM-FUT-02**: User can rate, review, rank, or purchase submitted apps.
- **PLATFORM-FUT-03**: Submitted apps can request runtime permissions.

## Out of Scope

Explicitly excluded from `v1.3` to keep the milestone focused on local state and workflow maturity.

| Feature | Reason |
|---------|--------|
| Notes sync/accounts | Backend-heavy identity and conflict-resolution scope; local information model must mature first. |
| Full rich-text editor framework adoption | Research recommends internal structured content before editor-engine complexity. |
| Attachments/scans/collaboration/locked notes | These expand Notes beyond the state-contract milestone. |
| Safari-parity Browser claims | iframe and embedding limits remain real; v1.3 must keep truthful fallback behavior. |
| Full Browser history/downloads/passwords/private mode/extensions | Larger browser-product surface than needed for tab/session maturity. |
| Arbitrary app install/run | Reviewed catalog metadata should mature before an install escape hatch. |
| Marketplace commerce, ratings, reviews, or permissions | Platform governance and runtime capabilities are not ready for marketplace behavior. |
| Global state manager dependency | Existing app/platform seams are sufficient; no new runtime state package is justified. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| STATE-01 | Phase 28 | Pending |
| STATE-02 | Phase 23 | Complete |
| STATE-03 | Phase 23 | Complete |
| STATE-04 | Phase 23 | Complete |
| STATE-05 | Phase 28 | Pending |
| NOTES-01 | Phase 24 | Complete |
| NOTES-02 | Phase 25 | Pending |
| NOTES-03 | Phase 25 | Pending |
| NOTES-04 | Phase 24 | Complete |
| NOTES-05 | Phase 25 | Pending |
| BROWSER-01 | Phase 26 | Pending |
| BROWSER-02 | Phase 26 | Pending |
| BROWSER-03 | Phase 26 | Pending |
| BROWSER-04 | Phase 26 | Pending |
| BROWSER-05 | Phase 26 | Pending |
| BROWSER-06 | Phase 26 | Pending |
| PLATFORM-01 | Phase 27 | Pending |
| PLATFORM-02 | Phase 27 | Pending |
| PLATFORM-03 | Phase 27 | Pending |
| PLATFORM-04 | Phase 27 | Pending |
| PLATFORM-05 | Phase 27 | Pending |
| PLATFORM-06 | Phase 27 | Pending |

**Coverage:**
- v1.3 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-05-27*
*Last updated: 2026-05-27 after roadmap creation*
