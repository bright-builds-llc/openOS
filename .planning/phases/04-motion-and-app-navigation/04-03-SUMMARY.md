---
phase: 04-motion-and-app-navigation
plan: "03"
subsystem: ui
tags: [home-pill, close-transition, reduced-motion, app-surface, navigation]
requires:
  - phase: 04-01
    provides: motion-aware navigation state
  - phase: 04-02
    provides: shared motion layer and icon-origin open transitions
provides:
  - Shared Home pill mounted inside the app surface
  - Reverse-to-home close behavior through the same motion system
  - Reduced-motion-aware close transition polish
affects: [calculator-fidelity, verification-phase]
tech-stack:
  added: []
  patterns: [shared app-surface chrome, reversible transition controller, same-state-machine reduced-motion close]
key-files:
  created:
    - src/features/motion/HomePill.tsx
  modified:
    - src/features/runtime/AppSurface.tsx
    - src/features/runtime/runtimeShell.css
    - src/features/motion/MotionLayer.tsx
    - src/features/motion/motionNavigation.css
    - src/features/shell/AdaptiveShellFoundation.tsx
key-decisions:
  - "The Home pill lives in the shared app surface, not in Calculator or placeholder content."
  - "Close behavior uses the same controller as open behavior, with a softer reduced-motion variant."
patterns-established:
  - "App open and close are now one reversible system."
  - "The Home pill is shell chrome, not app content."
requirements-completed: [MOTN-02, MOTN-03]
duration: 2min
completed: 2026-04-04
---

# Phase 4: Motion and App Navigation Summary

**Shared Home pill and reverse-to-home close transitions complete the launcher’s reversible motion loop**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-04T03:41:13-05:00
- **Completed:** 2026-04-04T08:42:50Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Added the shared Home pill as app-surface chrome
- Made Home-button taps reverse the launcher back to the home screen instead of hard-cutting
- Polished the reduced-motion close path so it stays semantically identical while visually gentler

## Task Commits

The close-path work landed across the main motion UI commit plus a final integration follow-up:

1. **Task 1: Create the shared Home pill component** - `4415c20`, `25bce3f` (feat)
2. **Task 2: Wire reverse-to-home close behavior through the shared motion layer** - `4415c20`, `25bce3f` (feat)
3. **Task 3: Add reduced-motion close behavior and final transition polish** - `4415c20`, `25bce3f` (feat)

## Files Created/Modified
- `src/features/motion/HomePill.tsx` - shared centered Home-pill control
- `src/features/runtime/AppSurface.tsx` - shared app surface now hosts shell chrome
- `src/features/runtime/runtimeShell.css` - Home-pill and app-surface chrome styling
- `src/features/motion/motionNavigation.css` - close-transition and reduced-motion close behavior
- `src/features/shell/AdaptiveShellFoundation.tsx` - reverse-to-home close behavior and runtime-state sync

## Decisions Made
- Kept the Home pill inside the shared app surface so it feels like shell chrome instead of app UI
- Preserved the same motion state machine for reduced motion instead of creating a separate close path

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Shared boundary correction] Moved the Home pill into `AppSurface` after the first motion integration pass**
- **Found during:** Final Phase 4 integration review
- **Issue:** The Home pill initially rendered outside the shared app surface, which made the shell boundary inconsistent with the plan
- **Fix:** Moved the Home pill into `AppSurface` and kept the motion layer focused on transition orchestration
- **Files modified:** `src/features/motion/MotionLayer.tsx`, `src/features/shell/AdaptiveShellFoundation.tsx`
- **Verification:** `pnpm test`, `npx tsc --noEmit`, and `pnpm build` all passed after the adjustment
- **Committed in:** `25bce3f`

---

**Total deviations:** 1 auto-fixed (shared boundary correction)
**Impact on plan:** No scope change; the fix made the implementation match the intended shell ownership model.

## Issues Encountered

None beyond the final Home-pill placement correction.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 5 can now focus on Calculator fidelity without needing to invent new launch/close behavior
- The launcher now has a full reversible navigation loop, which sets up the later verification work cleanly

---
*Phase: 04-motion-and-app-navigation*
*Completed: 2026-04-04*
