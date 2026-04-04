---
phase: 06-verification-and-launch-polish
plan: "01"
subsystem: test-infrastructure
tags: [playwright, webkit, selectors, launcher, calculator]
requires: []
provides:
  - WebKit-first Playwright infrastructure
  - Shared browser and standalone launcher helpers
  - Stable selector contract for launcher, app surfaces, Home pill, and Calculator
affects: [qual-01, qual-02, browser-verification]
tech-stack:
  added: ["@playwright/test"]
  patterns: [shared launcher helper, stable data-testid selectors]
key-files:
  created:
    - playwright.config.ts
    - tests/e2e/fixtures/launcher.ts
  modified:
    - package.json
    - pnpm-lock.yaml
    - .gitignore
    - src/features/shell/components/AppIconButton.tsx
    - src/features/runtime/AppSurface.tsx
    - src/features/motion/HomePill.tsx
    - src/features/apps/calculator/CalculatorApp.tsx
    - src/features/install/browser/BrowserInstallOverlay.tsx
key-decisions:
  - "Kept Phase 6 browser coverage WebKit-first and iPhone-shaped instead of adding broader cross-browser scope."
  - "Used the existing `openos-install-context=standalone` override for deterministic standalone tests."
  - "Validated Playwright configuration with `--pass-with-no-tests` because Wave 1 intentionally lands before any specs exist."
patterns-established:
  - "End-to-end tests target runtime surfaces through explicit `data-testid` contracts instead of text or CSS coupling."
requirements-completed: []
duration: 11min
completed: 2026-04-04
---

# Phase 6 Wave 1 Summary

**Playwright infrastructure is now in place for WebKit/iPhone-style verification, with stable selectors across the launcher and Calculator path**

## Performance

- **Duration:** 11 min
- **Completed:** 2026-04-04
- **Tasks:** 3
- **Files modified:** 9
- **Files created:** 2

## Accomplishments

- Added `@playwright/test` and a dedicated `test:e2e` script
- Configured a WebKit-first Playwright project around the Vite dev server
- Added shared helpers for browser-mode and deterministic standalone-mode entry
- Exposed stable `data-testid` selectors for app icons, app surfaces, Home pill, Calculator keys/display, and the browser install overlay

## Verification

- `pnpm install`
- `pnpm exec playwright install webkit`
- `npx tsc --noEmit`
- `pnpm build`
- `pnpm exec playwright test --list --pass-with-no-tests`

## Deviations from Plan

- The original dry-run check from the plan (`pnpm test:e2e -- --list`) fails before specs exist because Playwright exits nonzero on an empty suite.
- I kept the repo script unchanged for the real test phase and used `pnpm exec playwright test --list --pass-with-no-tests` to verify the configuration honestly at the infrastructure stage.

## Next Readiness

- Shell-flow specs can now target both browser mode and standalone mode through a shared launcher helper.
- Calculator browser scenarios can launch through the real runtime path without adding more selector plumbing.
