# iCeption

## What This Is

iCeption is a mobile web experience that aims to feel nearly indistinguishable from using an iPhone when opened fullscreen on an iPhone in portrait mode. V1 starts at the iPhone-style home screen, supports convincing app open and dismiss animations, and ships a high-fidelity Calculator app while laying the foundation for a broader web-based iOS-like app ecosystem.

Longer term, this project aims to become an open platform for browser-native "virtual iOS apps," including a basic UIKit-style library, a repo-driven app distribution model, and an escape hatch for installing arbitrary apps inside the experience.

## Core Value

When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Users can open the site as an installed fullscreen web app on iPhone and land on a convincing iPhone-style home screen.
- [ ] Users can browse a realistic home screen grid with dock, wallpaper feel, and status bar treatment that adapts sensibly across portrait iPhone sizes.
- [ ] Users can open apps with iPhone-like motion and return home through a custom bottom-center Home control while an app is open.
- [ ] Users can use a Calculator app that visually and behaviorally matches the standard portrait iPhone calculator closely enough to feel authentic.
- [ ] The system uses an extensible internal app model so additional built-in apps, repo-submitted apps, and escape-hatch apps can be added without redesigning the runtime.
- [ ] Unimplemented apps can still be launched into a polished full-screen "Coming Soon" experience instead of dead icons.

### Out of Scope

- Landscape mode — V1 is portrait-first and should focus on one convincing form factor before widening coverage.
- Widgets — not core to the first fidelity milestone and would distract from the home-screen/app-shell foundation.
- Notifications — requires additional system surfaces beyond the first interactive illusion target.
- Lock screen — a separate system surface that is not required to validate the home-screen-first concept.

## Context

This project starts greenfield in a nearly empty repository. The first milestone is deliberately narrow: create a high-fidelity installed web app experience on iPhone that reproduces the emotional feel of iOS home-screen interaction without needing to recreate the full operating system.

The user wants this to become a genuinely open alternative ecosystem over time, competing with the closed nature of iOS and the App Store by using web technologies instead of native platform gatekeeping. That means the V1 architecture should not hard-code Calculator as a one-off demo. It should establish a sensible app runtime, app metadata model, launch routing, and app shell contract that can grow into a small UIKit-style library, a repo-based app submission flow via pull requests, and an escape hatch for arbitrary virtual app installation.

Because the experience is web-based, the browser context matters. The primary target should be an installed fullscreen web app on iPhone, with the normal browser-tab experience acting as an onboarding shell that encourages users to add the site to their home screen. The design goal is not literal Apple branding. The project should avoid Apple logos and similar trademark-heavy branding while still pursuing close interaction and visual parity where legally and practically appropriate.

## Constraints

- **Platform**: Mobile web on iPhone in portrait — V1 must feel right on iPhone-sized portrait viewports rather than trying to generalize across every device class immediately.
- **Installation model**: Fullscreen installed web app is the primary experience — immersion and status-bar treatment are materially better there than in a normal browser tab.
- **Responsive fidelity**: Support essentially all portrait iPhone sizes — layout metrics, spacing, and safe-area treatment need sensible adaptation instead of being tuned to one fixed device.
- **Interaction fidelity**: Home screen layout, wallpaper and dock feel, status bar treatment, app motion, touch responsiveness, and calculator behavior are non-negotiable V1 quality bars.
- **Architecture**: Build a real internal app model from V1 — the first slice must support future apps, a UIKit-like layer, and app distribution without a rewrite.
- **Brand/IP**: Avoid literal Apple logos and similar trademark-heavy branding — the project can pursue close UX parity without relying on protected Apple marks.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Make installed fullscreen usage the primary target on iPhone | The illusion is materially stronger when browser chrome is removed and safe areas can be treated more predictably | — Pending |
| Use a realistic full app grid with placeholder apps | The home screen should feel complete even before most apps are implemented | — Pending |
| Launch unimplemented apps into a polished full-screen "Coming Soon" state | Placeholder icons should still preserve the illusion instead of acting broken or inert | — Pending |
| Ship only the portrait standard Calculator in V1 | Keeps the first app narrow while still exercising fidelity, layout, input behavior, and app-shell transitions | — Pending |
| Build an extensible app model in V1 instead of a Calculator-only demo | The long-term goal depends on future app extensibility, app distribution, and escape-hatch installs | — Pending |
| Avoid literal Apple logos and related marks | Reduces unnecessary IP risk while still allowing close UX inspiration | — Pending |

---
*Last updated: 2026-03-31 after initialization*
