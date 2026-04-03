# Project Research Summary

**Project:** openOS
**Domain:** browser-native iPhone-like installed web app shell
**Researched:** 2026-03-31
**Confidence:** MEDIUM

## Executive Summary

openOS is best treated as an installed, standalone mobile web app rather than a normal website with an iPhone skin. The current Apple user flow for iPhone web apps explicitly supports “Add to Home Screen” with “Open as Web App,” and both Apple and MDN documentation make clear that installed display mode, viewport handling, and safe-area treatment materially change how the experience behaves. That means the architecture and roadmap should optimize first for standalone iPhone usage, while normal browser mode acts as an onboarding shell.

The strongest technical recommendation is a React + TypeScript + Vite client application with a real app runtime from the start: app registry, launcher state, motion orchestration, device-profile derivation, and a shared app shell. This avoids the common trap of shipping a Calculator-only demo that must be rewritten as soon as the second app appears. The main risk is fidelity drift across iPhone sizes and display modes, which is why lightweight Playwright UI tests should be in scope from the first real feature milestone.

## Key Findings

### Recommended Stack

This domain does not need a server-heavy framework first. It needs fast iteration, strong component boundaries, typed runtime contracts, and direct control over installed-web-app behavior. React 19.2.4, TypeScript 6.0.2, and Vite 8.0.3 are the cleanest fit for that combination.

The PWA layer should be explicit and intentional. Manifest/display/orientation configuration, Apple touch icon behavior, safe-area handling, and viewport detection are not implementation details here; they are core product mechanics. Playwright and Vitest should be treated as part of the platform, not afterthought tooling.

**Core technologies:**
- React — UI composition for shell, home screen, and apps
- TypeScript — typed app registry, shell state, and layout models
- Vite — fast build/dev loop for animation-heavy frontend work
- Web App Manifest + Service Worker — installed-web-app behavior and shell reliability
- Playwright + Vitest — browser regression coverage and pure logic tests

### Expected Features

The table stakes are clear: installed-mode onboarding, a convincing home screen, correct status-bar/dock/safe-area treatment, reversible app motion, a working portrait Calculator, polished placeholder apps, and basic UI tests. Missing any of those will make the product feel like a themed website instead of a credible iPhone-like shell.

**Must have (table stakes):**
- Installed-mode onboarding and standalone shell
- Home screen with realistic app grid, dock, wallpaper feel, and status bar
- App launch/dismiss motion plus custom Home control
- Working portrait Calculator
- Basic Playwright UI tests

**Should have (competitive):**
- Extensible app runtime from V1
- Size-flexible fidelity across portrait iPhone sizes
- Future-ready UIKit-like shell primitives

**Defer (v2+):**
- App store / PR-based app distribution
- Escape-hatch arbitrary app installs
- Widgets, notifications, lock screen, landscape mode

### Architecture Approach

The architecture should separate platform detection, runtime state, and presentation. Browser APIs such as `display-mode`, `VisualViewport`, and safe-area handling belong in adapters that feed a typed runtime. The runtime should own which app exists, whether it is opening, open, or closing, and which layout profile applies. The shell and apps then render from that state.

**Major components:**
1. **Platform adapters** — viewport, safe area, display-mode, and installed-context detection
2. **App runtime** — app registry, launcher state machine, placeholder app handling
3. **Shell UI** — status bar, home screen, dock, app frame, custom Home button
4. **App modules** — Calculator first, more apps later
5. **Test support** — stable selectors and regression helpers for core flows

### Critical Pitfalls

1. **Single-device layout assumptions** — avoid by deriving device profiles from viewport and safe-area inputs
2. **Browser/install-mode confusion** — avoid by making installed mode primary and browser mode onboarding-only
3. **Calculator-demo architecture** — avoid by introducing an app registry and shell contract immediately
4. **Unstructured motion logic** — avoid by modeling shell states explicitly and centralizing motion tokens
5. **No browser UI tests** — avoid by adding Playwright coverage for the main user journey early

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Installable Shell Foundation
**Rationale:** The experience only makes sense if installed mode, viewport handling, and safe-area behavior are correct.
**Delivers:** Manifest/install flow, standalone detection, device-profile derivation, shell bootstrap
**Addresses:** Installed experience, responsive fidelity
**Avoids:** Browser/install-mode confusion and one-device layout drift

### Phase 2: Home Screen Runtime
**Rationale:** The home screen is the first trust test and depends on the shell foundation.
**Delivers:** App registry, realistic icon grid, dock, wallpaper feel, placeholder app handling
**Uses:** Typed runtime and device-profile tokens
**Implements:** App runtime and shell UI boundaries

### Phase 3: Motion System and App Shell
**Rationale:** Launch/dismiss behavior is part of the product promise and needs explicit state before Calculator work deepens.
**Delivers:** App open/dismiss transitions, custom Home button, shell-mounted app lifecycle
**Uses:** Motion tokens and launcher state machine
**Implements:** Reversible motion without component sprawl

### Phase 4: Calculator App
**Rationale:** Calculator validates whether the shell and runtime actually support a believable app.
**Delivers:** Portrait-standard calculator behavior and visuals
**Uses:** App shell, input handling, responsive metrics
**Implements:** First real app module

### Phase 5: Verification and Polish
**Rationale:** Fidelity-heavy UI degrades fast without browser regression coverage and final tuning.
**Delivers:** Playwright tests, visual/timing polish, install/onboarding refinement
**Uses:** Stable selectors and shell/app observability
**Implements:** Confidence for future app additions

### Phase Ordering Rationale

- Installed mode and layout primitives come first because every later feature depends on them.
- The app runtime must exist before the first real app to avoid a demo-first rewrite.
- Motion should be modeled before deep app work so Calculator fits the shell instead of bypassing it.
- Verification belongs before expansion because fidelity regressions are otherwise inevitable.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** iPhone-specific installed-mode edge cases and real-device verification strategy
- **Phase 3:** Motion tuning and reduced-motion behavior that preserve feel without brittle timing
- **Future app-store phases:** contributor workflow, trust boundaries, and app sandboxing

Phases with standard patterns (skip research-phase):
- **Phase 2:** app registry/runtime structure is straightforward given the current goals
- **Phase 4:** calculator behavior is a bounded first-app implementation once shell/runtime exist

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Strong official-source basis, but exact PWA plugin choice still needs bootstrap validation |
| Features | HIGH | User intent is clear and table stakes are concrete |
| Architecture | MEDIUM | Strong fit for the current goals, but future contributor app model will need later refinement |
| Pitfalls | HIGH | The main failure modes are already obvious from the platform constraints and project shape |

**Overall confidence:** MEDIUM

### Gaps to Address

- Real-device Safari validation strategy: confirm how aggressively early phases should require physical iPhone testing
- PWA integration path: decide during implementation whether `vite-plugin-pwa` is helpful enough or whether manual manifest/SW wiring is cleaner
- Future third-party app model: defer details until the built-in runtime proves itself with multiple first-party apps

## Sources

### Primary (HIGH confidence)
- [Apple Support: Turn a website into an app in Safari on iPhone](https://support.apple.com/en-bw/guide/iphone/iphea86e5236/26/ios/26) — install flow and “Open as Web App”
- [Apple Safari Web Content Guide: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) — standalone mode, status bar, icons
- [Apple Safari Web Content Guide: Configuring the Viewport](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html) — iPhone viewport guidance
- [MDN: `display` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display) — display semantics
- [MDN: `display-mode` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode) — installed-context detection
- [MDN: `orientation` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/orientation) — portrait preference
- [MDN: `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env) — safe-area insets
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport) — viewport/keyboard adaptation
- [Vite](https://vite.dev/) — current frontend build tool docs
- [React](https://react.dev/) — current React docs/version
- [Vitest guide](https://vitest.dev/guide/) — Vite-integrated test guidance
- [Playwright installation docs](https://playwright.dev/docs/intro) — cross-browser browser automation guidance

### Secondary (MEDIUM confidence)
- npm package registry versions for `react`, `vite`, `typescript`, `vitest`, `@playwright/test`, `@vitejs/plugin-react`, and `vite-plugin-pwa`

---
*Research completed: 2026-03-31*
*Ready for roadmap: yes*
