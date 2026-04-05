---
phase: 08-preview-install-ux-parity-cleanup
plan: "03"
subsystem: browser-entry
tags: [playwright, browser-mode, preview-parity, install-assist, verification]
requires:
  - phase: 08-02
    provides: shared install-assist behavior
  - phase: 08-01
    provides: shared browser preview selector
provides:
  - Focused browser-entry Playwright coverage
  - Stable hooks for preview parity and install-assist assertions
  - Final verification lock for the optional cleanup phase
affects: [phase-verification, browser-entry-regressions]
tech-stack:
  added: []
  patterns: [behavior-focused browser-entry assertions, stable preview test hooks]
key-files:
  created:
    - tests/e2e/browser-entry.spec.ts
  modified:
    - tests/e2e/fixtures/launcher.ts
    - src/features/install/browser/PreviewShell.tsx
    - src/features/install/browser/BrowserInstallFlow.tsx
key-decisions:
  - "Kept the browser-entry assertions behavior-focused and avoided CSS-detail snapshots."
  - "Added only the minimal stable hooks needed to make the browser-entry behavior testable."
patterns-established:
  - "Browser preview parity and install-assist behavior are now protected by dedicated browser-mode coverage."
requirements-completed: [INST-01, HOME-02, HOME-03, RUNT-01]
duration: 6min
completed: 2026-04-05
---

# Phase 8 Plan 03 Summary

**Browser-entry parity and install-assist behavior are now protected by narrow Playwright coverage instead of relying on visual inspection**

## Accomplishments

- Added a dedicated browser-entry Playwright spec for preview/runtime parity and install-assist behavior
- Added only the small stable hooks needed for behavior-focused assertions
- Ran the full narrow verification set so the cleanup phase stays additive instead of destabilizing the existing browser path

## Verification

- `pnpm test:e2e -- tests/e2e/browser-entry.spec.ts --project=webkit-iphone`
- `pnpm test`
- `pnpm test:e2e --project=webkit-iphone`
- `npx tsc --noEmit`
- `pnpm build`

## Notes

- The temporary manual-UAT preview listener on `42317` had to be stopped before the repo’s normal Playwright verification could run again under `reuseExistingServer: false`.
- The plan stayed inside the browser-entry surface and did not reopen installed-boundary, shell, motion, or milestone-docs work.
