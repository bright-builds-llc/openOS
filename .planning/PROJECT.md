# openOS

## What This Is

openOS is a shipped mobile web experience that aims to feel nearly indistinguishable from using an iPhone when opened fullscreen on an iPhone in portrait mode. `v1.1` grows the project from a shell-and-Calculator proof into the first believable multi-app system, adding page-aware home screens, `Settings`, `Notes`, a truthful managed-iframe `Browser`, and the first reusable app-platform primitives.

Longer term, the project still aims to become an open platform for browser-native "virtual iOS apps," including a basic UIKit-style library, a repo-driven app distribution model, and an escape hatch for installing arbitrary apps inside the experience.

## Core Value

When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## Current State

- **Shipped version:** `v1.1` on 2026-04-09
- **User-facing surface:** install-first Safari onboarding, adaptive shell, shared launcher/runtime/motion system, multi-page home screens, high-fidelity Calculator, real `Settings`, local-only `Notes`, and a truthful managed-iframe `Browser`
- **Verification:** milestone audit passed after `pnpm test` (`95` tests), `pnpm test:e2e --project=webkit-iphone` (`16` tests), and `pnpm build`
- **Codebase:** React 19, Vite 8, TypeScript 6, Vitest 4, Playwright 1.59, with about 6,538 lines of TypeScript/TSX in `src/` and `tests/`

## Requirements

### Validated

- ✓ Install-first Safari onboarding and standalone Home Screen launch flow — `v1`
- ✓ Adaptive portrait iPhone shell, shared launcher/runtime/motion system, and high-fidelity Calculator — `v1`
- ✓ Multi-page home-screen behavior with launcher return-to-origin semantics — `v1.1`
- ✓ Reusable internal app-platform primitives for app definitions, settings participation, and storage namespaces — `v1.1`
- ✓ Real `Settings` app with persistent preferences and internal app-management surface — `v1.1`
- ✓ Real local-only `Notes` app with browser-verified persistence and honest no-sync messaging — `v1.1`
- ✓ Truthful managed-iframe `Browser` with curated destinations, graceful fallback, and integrated launcher-path verification — `v1.1`

### Active

- [ ] Users can search notes and organize them with folders or tags.
- [ ] Users can sync notes across devices/accounts and use richer editing than plain text.
- [ ] Users can browse beyond the current curated/embed-safe Browser scope without making dishonest product claims.
- [ ] Contributors can submit, browse, and install virtual apps through a repo-driven platform flow.

### Out of Scope

- Landscape mode until the portrait iPhone experience remains strong as the product grows.
- Widgets, notifications, and lock screen system surfaces before the app platform and core shell mature further.
- Literal Apple logos and related marks.

## Context

`v1` proved the install boundary, shell fidelity, shared launcher/runtime path, motion system, and first real app. `v1.1` then validated that openOS can grow carefully without breaking the illusion: the home screen can span multiple pages, real built-in apps can share a platform contract, and browser constraints can be handled truthfully instead of hidden behind fake general-purpose browsing claims.

The next milestone is still intentionally open. The strongest available directions are expanding Notes, broadening Browser carefully, and turning the internal app-platform layer into something contributors can build against without rewriting the current runtime seams.

## Constraints

- **Platform:** Mobile web on iPhone in portrait remains the primary target.
- **Installation model:** Fullscreen installed web app is still the intended experience.
- **Responsive fidelity:** Support essentially all portrait iPhone sizes without weakening the illusion.
- **Interaction fidelity:** Home screen, motion, touch response, and built-in app quality remain non-negotiable.
- **Architecture:** Keep app identity, launcher behavior, settings participation, and storage ownership on shared runtime/platform seams.
- **Verification:** Maintain browser-level regression coverage for illusion-critical and milestone-defining user flows.
- **Brand/IP:** Avoid literal Apple marks while pursuing close UX parity.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Make installed fullscreen usage the primary target on iPhone | The illusion is materially stronger without browser chrome | ✓ Validated in `v1` |
| Build an extensible app model early instead of a Calculator-only demo | Future apps and platform work needed shared launcher/runtime seams from the start | ✓ Validated in `v1` |
| Keep Browser truthful and limited to curated/embed-safe destinations | Arbitrary browsing is constrained by iframe embedding policy and would be dishonest to overclaim | ✓ Validated in `v1.1` |
| Use shared platform metadata as the source of truth for app identity, settings participation, and storage | Multiple built-in apps needed one reusable contract instead of ad hoc wiring | ✓ Validated in `v1.1` |
| Close milestone audit gaps with focused cleanup instead of reopening broad scope | Preserved momentum and fixed the actual truthfulness issue in app-side code | ✓ Validated in `v1.1` |

## Next Milestone Goals

- Decide whether the next milestone focuses first on Notes expansion, Browser expansion, or platform distribution.
- Preserve the truthful install-and-launcher-path quality bar while adding broader app capability.
- Introduce the next milestone explicitly through `$gsd-new-milestone` rather than letting post-`v1.1` work drift.

<details>
<summary>Archived milestone framing</summary>

### Completed Milestone

`v1.1 Core Apps & Platform Foundations` shipped on 2026-04-09 after Phases 9-15 and a passing milestone audit.

</details>

---
*Last updated: 2026-04-09 after completing v1.1 milestone*
