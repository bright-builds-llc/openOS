# Requirements Archive: v1 iPhone Web App Foundation

**Archived:** 2026-04-05
**Status:** SHIPPED

## Requirement Outcomes

- **Validated:** all 20 v1 requirements shipped and were verified through phase execution plus milestone audit
- **Adjusted:** none
- **Dropped:** none

For next-milestone requirements, start a fresh `.planning/REQUIREMENTS.md` via `$gsd-new-milestone`.

---

# Requirements: openOS

**Defined:** 2026-03-31
**Core Value:** When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## v1 Requirements

### Install and Shell

- [x] **INST-01**: User can open the site in mobile Safari on iPhone and see onboarding that explains how to add it to the Home Screen as a web app.
- [x] **INST-02**: User can launch the installed web app from the iPhone Home Screen and enter the experience in standalone app mode.
- [x] **INST-03**: User can use the experience in portrait orientation across supported iPhone viewport sizes with layout metrics that adapt sensibly to the device.

### Home Screen

- [x] **HOME-01**: User lands on an iPhone-like home screen with wallpaper, status bar treatment, app grid, and dock.
- [x] **HOME-02**: User sees a full realistic grid of app icons and labels rather than a sparse single-app screen.
- [x] **HOME-03**: User can tap any visible app icon from the home screen.
- [x] **HOME-04**: User opening an unimplemented app sees a polished full-screen "Coming Soon" app state instead of a dead icon or broken route.

### App Runtime

- [x] **RUNT-01**: The system defines apps through an internal app model that includes app identity, icon metadata, availability state, and launch target.
- [x] **RUNT-02**: The runtime can launch both implemented apps and "Coming Soon" apps through the same app model instead of hard-coded per-app branching.
- [x] **RUNT-03**: The shell can host additional apps later without redesigning the home-screen launcher or app container.

### Motion and App Shell

- [x] **MOTN-01**: User opening an implemented app sees a smooth iPhone-like launch transition from the tapped icon into the full-screen app view.
- [x] **MOTN-02**: User can return from an open app to the home screen through a bottom-center Home control with a matching dismiss transition.
- [x] **MOTN-03**: The Home control appears only while an app is open and does not interfere with core app interactions.

### Calculator

- [x] **CALC-01**: User can open Calculator from the home screen as a real implemented app.
- [x] **CALC-02**: User can enter digits and decimals into Calculator and see the current value update correctly.
- [x] **CALC-03**: User can perform addition, subtraction, multiplication, and division in Calculator.
- [x] **CALC-04**: User can use clear/all clear, sign toggle, and percent in Calculator.
- [x] **CALC-05**: Calculator visually matches the standard portrait iPhone calculator closely enough to feel authentic on supported iPhone sizes.

### Verification

- [x] **QUAL-01**: Automated browser UI tests verify the main shell flow: onboarding/browser mode, home-screen render, implemented app launch, implemented app dismiss, and placeholder app launch.
- [x] **QUAL-02**: Automated browser UI tests verify the main Calculator happy-path interactions at a basic level.

## v2 Requirements

### More Apps and Home Behavior

- **APPS-01**: User can open additional implemented built-in apps beyond Calculator.
- **HOME-05**: User can navigate between multiple home-screen pages.

### Platform Growth

- **PLAT-01**: Developers can build apps against a reusable UIKit-like web layer.
- **PLAT-02**: Contributors can submit apps through a repo-driven review flow.
- **PLAT-03**: User can browse and install apps from a basic in-product app catalog.
- **PLAT-04**: User can install arbitrary virtual apps through an escape-hatch flow.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Landscape mode | V1 is portrait-first and should prove one convincing mode before expanding |
| Widgets | Not required to validate the home-screen/app-shell foundation |
| Notifications | Expands system surface before core shell fidelity is proven |
| Lock screen | Separate system surface outside the first milestone |
| Scientific landscape calculator | Landscape is out of scope for V1 |
| Literal Apple logos/branding | Avoid unnecessary IP/trademark exposure while preserving close UX parity |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INST-01 | Phase 1 | Complete |
| INST-02 | Phase 1 | Complete |
| INST-03 | Phase 2 | Complete |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 3 | Complete |
| HOME-04 | Phase 3 | Complete |
| RUNT-01 | Phase 3 | Complete |
| RUNT-02 | Phase 3 | Complete |
| RUNT-03 | Phase 3 | Complete |
| MOTN-01 | Phase 4 | Complete |
| MOTN-02 | Phase 4 | Complete |
| MOTN-03 | Phase 4 | Complete |
| CALC-01 | Phase 5 | Complete |
| CALC-02 | Phase 5 | Complete |
| CALC-03 | Phase 5 | Complete |
| CALC-04 | Phase 5 | Complete |
| CALC-05 | Phase 5 | Complete |
| QUAL-01 | Phase 6 | Complete |
| QUAL-02 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-04-05 after phase 8 completion*
