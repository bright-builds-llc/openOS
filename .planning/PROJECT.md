# openOS

## What This Is

openOS is a shipped mobile web experience that aims to feel nearly indistinguishable from using an iPhone when opened fullscreen on an iPhone in portrait mode. V1 delivers the iPhone-style home screen, convincing app open/dismiss motion, a high-fidelity Calculator app, and the platform foundations for a broader web-based iOS-like app ecosystem.

Longer term, this project aims to become an open platform for browser-native "virtual iOS apps," including a basic UIKit-style library, a repo-driven app distribution model, and an escape hatch for installing arbitrary apps inside the experience.

## Core Value

When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## Current State

- **Shipped version:** `v1` on 2026-04-05
- **User-facing surface:** install-first Safari onboarding, standalone launch intro, adaptive home screen, shared launcher/runtime/motion system, placeholder app surfaces, and a high-fidelity Calculator
- **Verification:** WebKit browser coverage for shell flow, Calculator, installed-boundary truthfulness, and browser-entry parity
- **Codebase:** React 19, Vite 8, TypeScript 6, Vitest 4, Playwright 1.59, with about 3,975 lines of TypeScript/TSX in the current repo

## Requirements

### Validated

- ✓ Installed Safari onboarding and standalone Home Screen launch — `v1`
- ✓ Adaptive portrait iPhone-like home screen with wallpaper, status bar, full grid, and dock — `v1`
- ✓ Shared launcher runtime with placeholder app surfaces and reversible motion/Home-pill navigation — `v1`
- ✓ High-fidelity portrait Calculator implemented through the shared runtime path — `v1`
- ✓ Browser-level shell, Calculator, installed-boundary, and browser-entry verification — `v1`

### Active

- [ ] Users can open additional implemented built-in apps beyond Calculator.
- [ ] Users can navigate between multiple home-screen pages.
- [ ] Developers can build apps against a reusable UIKit-like web layer.
- [ ] Contributors can submit apps through a repo-driven review flow.
- [ ] Users can browse and install apps from a basic in-product app catalog.
- [ ] Users can install arbitrary virtual apps through an escape-hatch flow.

### Out of Scope

- Landscape mode — V1 is portrait-first and should focus on one convincing form factor before widening coverage.
- Widgets — not core to the first fidelity milestone and would distract from the home-screen/app-shell foundation.
- Notifications — requires additional system surfaces beyond the first interactive illusion target.
- Lock screen — a separate system surface that is not required to validate the home-screen-first concept.

## Context

V1 proved that an installable, browser-native iPhone-inspired experience can feel coherent across install entry, adaptive shell rendering, shared runtime, motion, and a first real app. The shipped codebase now has the right architectural seams for broader growth: registry-driven app identity, shared app surfaces, explicit motion/navigation state, and meaningful browser verification around the core illusion-critical flows.

The next milestone should shift from “prove the illusion” to “grow the platform carefully.” The highest-value directions are additional implemented apps, multi-page home behavior, and the first reusable platform/app-distribution primitives. The browser onboarding/install surface is now in good shape and no longer needs to drive roadmap priority.

## Constraints

- **Platform**: Mobile web on iPhone in portrait — V1 must feel right on iPhone-sized portrait viewports rather than trying to generalize across every device class immediately.
- **Installation model**: Fullscreen installed web app is the primary experience — immersion and status-bar treatment are materially better there than in a normal browser tab.
- **Responsive fidelity**: Support essentially all portrait iPhone sizes — layout metrics, spacing, and safe-area treatment need sensible adaptation instead of being tuned to one fixed device.
- **Interaction fidelity**: Home screen layout, wallpaper and dock feel, status bar treatment, app motion, touch responsiveness, and calculator behavior are non-negotiable V1 quality bars.
- **Architecture**: Build a real internal app model from V1 — the first slice must support future apps, a UIKit-like layer, and app distribution without a rewrite.
- **Verification**: Add basic browser UI tests for key flows — the project should prove the illusion-critical interactions continue to work as features are added.
- **Brand/IP**: Avoid literal Apple logos and similar trademark-heavy branding — the project can pursue close UX parity without relying on protected Apple marks.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Make installed fullscreen usage the primary target on iPhone | The illusion is materially stronger when browser chrome is removed and safe areas can be treated more predictably | ✓ Validated in `v1` |
| Use a realistic full app grid with placeholder apps | The home screen should feel complete even before most apps are implemented | ✓ Validated in `v1` |
| Launch unimplemented apps into a polished full-screen "Coming Soon" state | Placeholder icons should still preserve the illusion instead of acting broken or inert | ✓ Validated in `v1` |
| Ship only the portrait standard Calculator in V1 | Keeps the first app narrow while still exercising fidelity, layout, input behavior, and app-shell transitions | ✓ Validated in `v1` |
| Build an extensible app model in V1 instead of a Calculator-only demo | The long-term goal depends on future app extensibility, app distribution, and escape-hatch installs | ✓ Validated in `v1` |
| Include basic browser UI tests from the first milestone | Core fidelity depends on interaction behavior, so lightweight regression coverage should exist before the app surface grows | ✓ Validated in `v1` |
| Avoid literal Apple logos and related marks | Reduces unnecessary IP risk while still allowing close UX inspiration | ✓ Maintained in `v1` |

## Next Milestone Goals

- Expand beyond Calculator with additional implemented built-in apps
- Introduce multi-page home-screen behavior without weakening the current shell illusion
- Begin the reusable UIKit-like web layer and app-host primitives
- Define the first contributor/app distribution workflow
- Explore the initial in-product catalog and escape-hatch install path

---
*Last updated: 2026-04-05 after v1 milestone*
