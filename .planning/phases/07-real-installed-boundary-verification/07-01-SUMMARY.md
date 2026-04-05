---
phase: 07-real-installed-boundary-verification
plan: "01"
subsystem: verification-harness
tags: [playwright, preview, install-context, boundary, webkit]
requires: []
provides:
  - Production-like Playwright server path
  - Installed-context helper that no longer uses the dev-only query override
  - Explicit app-context coverage for non-dev display-mode and legacy standalone entry
affects: [phase-7-boundary-proof, shell-flow, calculator-regression]
tech-stack:
  added: []
  patterns: [preview-backed browser verification, browser-signal installed-context harness]
key-files:
  created: []
  modified:
    - playwright.config.ts
    - tests/e2e/fixtures/launcher.ts
    - src/app/bootstrap/createAppContext.test.ts
key-decisions:
  - "Moved the boundary harness onto `vite preview` so Phase 7 no longer proves installed entry from a dev-only runtime."
  - "Replaced the query-string standalone shortcut with browser-signal injection that flows through the shipped install-context detection path."
patterns-established:
  - "Installed-context browser tests now target `display-mode` semantics instead of `dev-override` semantics."
requirements-completed: []
duration: 0min
completed: 2026-04-04
---

# Phase 7 Wave 1 Summary

**The installed-boundary harness now runs against a production-like preview server and enters standalone through shipped browser-signal detection instead of the dev-only query override**

## Accomplishments

- Switched Playwright from `pnpm dev` to a preview/build-backed server path
- Replaced the Phase 6 `?openos-install-context=standalone` helper with an installed-context helper that drives `display-mode` detection
- Added explicit app-context tests for non-dev `display-mode` and legacy standalone entry

## Verification

- `pnpm test`
- `pnpm exec playwright test --list --pass-with-no-tests`
- `npx tsc --noEmit`
- `pnpm build`

## Notes

- This harness is more truthful than the Phase 6 dev override, but it still represents a browser-signal-driven installed context rather than literal Home Screen launch automation.
- Phase 7 Wave 2 will add the explicit installed-boundary proof spec and migrate the shell/Calculator suites onto this harness.
