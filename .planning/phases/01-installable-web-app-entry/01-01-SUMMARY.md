---
phase: 01-installable-web-app-entry
plan: "01"
subsystem: infra
tags: [react, vite, typescript, vitest, install-context]
requires: []
provides:
  - Vite + React + TypeScript application scaffold
  - Typed install-context detection with unit tests
  - Separate browser and standalone entry branches for later Phase 1 work
affects: [install-flow, manifest, onboarding]
tech-stack:
  added: [react, react-dom, vite, @vitejs/plugin-react, typescript, vitest]
  patterns: [functional-core install detection, dev-only install-context override, branch-by-entry-surface]
key-files:
  created:
    - package.json
    - tsconfig.json
    - vite.config.ts
    - src/app/bootstrap/createAppContext.ts
    - src/lib/platform/detectInstallContext.ts
    - src/lib/platform/detectInstallContext.test.ts
    - src/features/install/browser/BrowserInstallFlow.tsx
    - src/features/install/standalone/StandaloneEntry.tsx
  modified:
    - index.html
    - src/App.tsx
    - src/app/AppRoot.tsx
    - src/styles/globals.css
key-decisions:
  - "Used a hand-authored Vite scaffold instead of generator output to keep the foundation minimal and repo-aware."
  - "Normalized install detection into a pure core with a dev-only query override for deterministic standalone verification."
patterns-established:
  - "Browser API reads stay in a thin bootstrap adapter while pure install-context logic lives in a testable module."
  - "Root app branches into browser and standalone entry surfaces instead of overloading a single component."
requirements-completed: [INST-01, INST-02]
duration: 2min
completed: 2026-03-31
---

# Phase 1: Installable Web App Entry Summary

**Vite-based React app scaffold with typed browser-vs-standalone detection and dedicated entry branches for the install funnel**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-31T18:27:00-05:00
- **Completed:** 2026-03-31T23:28:53Z
- **Tasks:** 3
- **Files modified:** 15

## Accomplishments
- Bootstrapped the repo into a runnable Vite + React + TypeScript application
- Added pure install-context detection with unit coverage and a dev-only standalone override path
- Split the root into dedicated browser and standalone entry surfaces so later work can stay isolated

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap the client app and root entry wiring** - `4c47f96` (feat)
2. **Task 2: Add install-context detection as a typed functional core** - `8e4ecc9` (test)
3. **Task 3: Create stable extension points for browser and standalone entry work** - `819af84` (feat)

## Files Created/Modified
- `package.json` - frontend scripts and dependencies for the new client app
- `vite.config.ts` - Vite and Vitest configuration
- `src/app/bootstrap/createAppContext.ts` - thin bootstrap adapter for install-context creation
- `src/lib/platform/detectInstallContext.ts` - pure install-context detection logic
- `src/lib/platform/detectInstallContext.test.ts` - unit tests for browser, standalone, legacy, and override cases
- `src/features/install/browser/BrowserInstallFlow.tsx` - browser entry branch placeholder
- `src/features/install/standalone/StandaloneEntry.tsx` - standalone entry branch placeholder

## Decisions Made
- Used a hand-authored scaffold to keep the initial surface small and explicit
- Added a dev-only query-string override so standalone behavior can be tested locally without a real installed web app

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added `src/vite-env.d.ts` and corrected the Vite/Vitest config import**
- **Found during:** Task 1 (Bootstrap the client app and root entry wiring)
- **Issue:** The first build failed because CSS side-effect imports were untyped and `defineConfig` came from the wrong package for the embedded test config
- **Fix:** Added `src/vite-env.d.ts` and switched `vite.config.ts` to import `defineConfig` from `vitest/config`
- **Files modified:** `src/vite-env.d.ts`, `vite.config.ts`
- **Verification:** `npx tsc --noEmit` and `pnpm build` passed afterward
- **Committed in:** `4c47f96` (part of Task 1 commit)

**2. [Rule 3 - Blocking] Allowed `pnpm test` to pass before the first test file existed**
- **Found during:** Task 1 verification flow
- **Issue:** The repo became a TypeScript project with a test script before any test file landed, which would have made the per-task commit gate fail for the scaffold commit
- **Fix:** Changed the test script to `vitest run --passWithNoTests`
- **Files modified:** `package.json`
- **Verification:** `pnpm test` returned success before Task 2, and later ran the real tests successfully
- **Committed in:** `4c47f96` (part of Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes were verification blockers in the scaffold and did not change scope.

## Issues Encountered
- Initial Vite/Vitest typing mismatch caused the first build to fail, which was corrected during scaffold verification

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Wave 2 can now implement the browser install funnel and installed entry behavior without rewriting root app structure
- Standalone verification now has a deterministic local path for development checks

---
*Phase: 01-installable-web-app-entry*
*Completed: 2026-03-31*
