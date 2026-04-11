# Requirements: openOS

**Defined:** 2026-04-09
**Core Value:** When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## v1.2 Requirements

### Notes

- [x] **NOTE-05**: User can search notes by title and body text.
- [x] **NOTE-06**: User can organize notes using folders or tags and browse notes through that structure.

### Browser

- [x] **BROW-05**: User can browse arbitrary sites rather than a curated/embed-safe set only.
- [x] **BROW-06**: User can enter arbitrary URLs directly.

### Platform

- [x] **PLAT-04**: Contributors can submit apps through a repo-driven review workflow.
- [x] **PLAT-05**: User can browse apps in an in-product app catalog.

### Verification

- [x] **QUAL-05**: Automated browser UI tests verify Notes search/organization and Browser direct-URL/truthful-fallback behavior at a basic level.
- [x] **QUAL-06**: Automated tests verify the repo-driven app-submission flow and in-product app catalog browsing at a basic level.

## Future Requirements

### Notes Expansion

- **NOTE-07**: User can sync notes across devices/accounts.
- **NOTE-08**: User can edit notes with richer formatting than plain text.

### Browser Expansion

- **BROW-07**: User can use multiple browser tabs.

### Platform Growth

- **PLAT-06**: User can install arbitrary virtual apps through an escape-hatch flow.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Notes sync/accounts | Adds backend and identity scope before local search and organization are proven |
| Rich-text notes editor | Increases editor complexity before the upgraded Notes information model settles |
| Browser tabs | Too much browser-state complexity for the first careful browsing expansion |
| Full Safari-parity browsing claims | The product must stay truthful about what can still require external fallback |
| Arbitrary app install escape hatch | Follows after submission and catalog foundations, not before them |

## Traceability

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
*Requirements defined: 2026-04-09*
*Last updated: 2026-04-11 after completing Phase 20*
