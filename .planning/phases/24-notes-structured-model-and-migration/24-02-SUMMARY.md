---
phase: 24-notes-structured-model-and-migration
plan: "02"
subsystem: notes-storage
tags: [typescript, vitest, notes, storage, migration]

requires:
  - phase: 24-01
    provides: Structured Notes content model, parser, and plain-text adapter helpers
  - phase: 23-state-contracts-and-verification-baseline
    provides: Durable Notes/session exact-key isolation guardrails
provides:
  - Durable Notes storage version 3 parser and write path
  - Lazy read migration for version-2 snapshots and legacy flat arrays into structured Notes content
  - Regression coverage for malformed durable payloads and Notes session/catalog key isolation
affects:
  - 24-notes-structured-model-and-migration
  - 25-notes-editor-and-resume

tech-stack:
  added: []
  patterns:
    - Storage-boundary parsing for explicit v3, v2, and legacy Notes variants
    - Lazy durable migration with version-3 writes only on mutation paths
    - Exact-key durable/session isolation regressions

key-files:
  created:
    - .planning/phases/24-notes-structured-model-and-migration/24-02-SUMMARY.md
  modified:
    - src/features/apps/notes/notesStorage.ts
    - src/features/apps/notes/notesStorage.test.ts

key-decisions:
  - "Used lazy persistence: v2 and legacy reads return structured Note.content immediately, while durable storage is rewritten as version 3 only through create/update/delete/write paths."
  - "Kept the durable Notes key on createAppStorageKey(namespace, \"notes\") and did not add any session-storage interaction to production Notes storage."
  - "Rejected invalid or malformed durable Notes payloads into an empty safe snapshot without removing session or unrelated catalog keys."

patterns-established:
  - "Versioned Notes storage parsing is split across parseStoredNoteV3, parseStoredNoteV2, and parseLegacySnapshot."
  - "Storage mutations convert NoteInput.body into Note.content through createNoteContentFromPlainText before serialization."

requirements-completed: [NOTES-01, NOTES-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 24-2026-05-28T03-12-00
generated_at: 2026-05-28T04:02:14Z

duration: 5min 13s
completed: 2026-05-28
---

# Phase 24 Plan 02: Notes Storage V3 Migration Summary

**Durable Notes v3 storage with lazy v2/legacy migration into structured local content**

## Performance

- **Duration:** 5min 13s
- **Started:** 2026-05-28T03:57:01Z
- **Completed:** 2026-05-28T04:02:14Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Bumped durable Notes storage to `version: 3` and added explicit parser paths for native v3 notes, version-2 body notes, and legacy flat note arrays.
- Converted v2 and legacy `body` text into structured `Note.content` through `createNoteContentFromPlainText` while preserving title, folder, `createdAt`, and `updatedAt`.
- Updated create and update write paths so durable snapshots serialize structured `content` only, without a canonical durable `body` field.
- Added focused storage tests for migration, normalization, duplicate de-dupe, missing-folder fallback, malformed durable payload safety, and durable/session/catalog key isolation.

## Task Commits

1. **Task 1: Implement version 3 migration parser and write path**
   - `3738498` test: add failing tests for notes v3 storage migration
   - `410fe28` feat: implement notes v3 storage migration
2. **Task 2: Preserve durable/session isolation regressions**
   - `97fe0ab` test: preserve notes durable session isolation with v3 fixtures

_Task 2 did not require production changes because Task 1's storage boundary already satisfied the isolation behavior; the task added explicit regression coverage._

## Files Created/Modified

- `src/features/apps/notes/notesStorage.ts` - Parses v3, v2, and legacy durable payloads into typed structured notes and writes normalized version-3 snapshots.
- `src/features/apps/notes/notesStorage.test.ts` - Covers v2/legacy migration, v3 parsing, normalization, v3-only writes, and durable/session/catalog key isolation.
- `.planning/phases/24-notes-structured-model-and-migration/24-02-SUMMARY.md` - Records this plan execution.

## Decisions Made

- Followed the 24-RESEARCH lazy migration decision: reads normalize old payloads immediately in memory, and durable storage is rewritten as v3 on mutation/write paths.
- Preserved the exact durable key `openos.apps.notes.notes`; production Notes storage does not call session-key helpers or clear broad storage state.
- Kept malformed durable Notes handling side-effect free: invalid payloads return an empty Notes collection and leave unrelated keys untouched.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed stale test fixture reference during v3 session-isolation rewrite**
- **Found during:** Task 2 (Preserve durable/session isolation regressions)
- **Issue:** The first Task 2 test run failed with `ReferenceError: createdNote is not defined` after replacing a `createStoredNote` fixture with an explicit v3 durable snapshot.
- **Fix:** Derived `durableNoteId` from the v3 snapshot fixture and used it for the explicit session reset regression.
- **Files modified:** `src/features/apps/notes/notesStorage.test.ts`
- **Verification:** `bun run test -- src/features/apps/notes/notesStorage.test.ts`
- **Committed in:** `97fe0ab`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The fix was limited to the new test fixture rewrite and did not change plan scope.

## Verification

- `bun run test -- src/features/apps/notes/notesStorage.test.ts` failed during Task 1 RED for the expected pre-implementation reasons: storage still emitted `body`, rejected v3 snapshots, and wrote storage version 2.
- `bun run test -- src/features/apps/notes/notesStorage.test.ts` passed after Task 1 GREEN.
- Task 1 acceptance `rg` checks passed for `NOTES_STORAGE_VERSION = 3`, distinct v3/v2/legacy parser paths, `createNoteContentFromPlainText` conversion calls, migration fixtures, and structured-content assertions.
- Task 1 forbidden production-storage check returned no matches for `createAppSessionStorageKey`, `resetAppSessionSnapshot`, `localStorage.clear`, or `.clear(` in `notesStorage.ts`.
- Task 2 acceptance `rg` checks passed for `openos.apps.catalog.reviewed`, `createAppSessionStorageKey`, and malformed durable/invalid payload coverage.
- Final `bun run test -- src/features/apps/notes/notesStorage.test.ts` passed with 13 tests.

## Known Stubs

None - scanned modified source and test files for placeholder, TODO/FIXME, "coming soon", "not available", and similar stub markers.

## Threat Flags

None - the touched production surface is the planned localStorage Notes parser/write boundary covered by the plan threat model; no new network endpoint, auth path, file access pattern, or unplanned trust boundary was introduced.

## Issues Encountered

- The optional execution-context file `/Users/peterryszkiewicz/.codex/get-shit-done/references/deviation-rules.md` was not present. The executor workflow and active developer instructions supplied the deviation protocol, so execution was not blocked.

## User Setup Required

None - no external service configuration required.

## State And Roadmap Updates

Not performed by design. This plan was executed under the phase orchestrator, and the user explicitly reserved `STATE.md`, `ROADMAP.md`, and requirements updates for orchestrator-level completion.

## Next Phase Readiness

Plan 24-03 can integrate the Notes UI/editor adapter with structured `Note.content` knowing durable reads now return structured notes and write paths persist v3 snapshots only.

## Self-Check: PASSED

- Confirmed `src/features/apps/notes/notesStorage.ts`, `src/features/apps/notes/notesStorage.test.ts`, and this summary file exist.
- Confirmed task commits `3738498`, `410fe28`, and `97fe0ab` exist in git history.
- Confirmed only `.planning/phases/24-notes-structured-model-and-migration/24-02-SUMMARY.md` was untracked after task commits, preserving the requested STATE/ROADMAP scope boundary.

---
*Phase: 24-notes-structured-model-and-migration*
*Completed: 2026-05-28*
