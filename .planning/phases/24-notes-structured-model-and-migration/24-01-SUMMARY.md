---
phase: 24-notes-structured-model-and-migration
plan: "01"
subsystem: notes-model
tags: [typescript, vitest, notes, structured-content]

requires:
  - phase: 23-state-contracts-and-verification-baseline
    provides: Durable Notes/session isolation guardrails for v1.3 state work
provides:
  - Versioned structured Notes content document with paragraph, heading, and checklist item blocks
  - Pure plain-text adapter, structured text extraction, and strict unknown-value parser
  - Notes model helpers that read canonical structured content for search, preview, and textarea adapter text
affects:
  - 24-notes-structured-model-and-migration
  - 25-notes-editor-and-resume

tech-stack:
  added: []
  patterns:
    - Functional core structured content helpers
    - Discriminated union for note content block states
    - Strict parser returning null for invalid unknown content documents

key-files:
  created:
    - src/features/apps/notes/notesContent.ts
    - src/features/apps/notes/notesContent.test.ts
  modified:
    - src/features/apps/notes/notesModel.ts
    - src/features/apps/notes/notesModel.test.ts

key-decisions:
  - "Used plain TypeScript data and pure helpers for structured note content; no editor, storage, browser, or React logic was added."
  - "Kept NoteInput.body as the plain textarea adapter surface while making Note.content the canonical model text field."
  - "Used strict parser rejection for invalid document versions, block kinds, and malformed checklist blocks."

patterns-established:
  - "Structured note text extraction goes through getNoteContentText(content)."
  - "Nullable parser outputs use maybe naming at the boundary and return null for invalid unknown input."

requirements-completed: [NOTES-01, NOTES-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 24-2026-05-28T03-12-00
generated_at: 2026-05-28T03:53:07Z

duration: 5min 23s
completed: 2026-05-28
---

# Phase 24 Plan 01: Structured Notes Model Summary

**Versioned structured Notes content with searchable paragraph, heading, and checklist text plus model-level preview/body adapter helpers**

## Performance

- **Duration:** 5min 23s
- **Started:** 2026-05-28T03:47:44Z
- **Completed:** 2026-05-28T03:53:07Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added `notesContent.ts` with a versioned `NoteContentDocument`, discriminated `NoteContentBlock`, plain-text conversion, text extraction, empty content creation, and strict parser.
- Added focused Vitest coverage for paragraph conversion, empty conversion, mixed text extraction, invalid version rejection, invalid kind rejection, and malformed checklist rejection.
- Updated `notesModel.ts` so `Note` uses canonical `content`, `NoteInput` keeps `body`, and search, previews, and body adapter text read structured content.
- Updated model tests for structured content search, all-term matching, heading/checklist previews, empty preview fallback, body adapter text, and default-folder sorting.

## Task Commits

1. **Task 1: Add pure structured content helpers**
   - `06c911f` test: add failing tests for structured note content
   - `cab9a80` feat: implement structured note content helpers
2. **Task 2: Move search and previews to structured content**
   - `2cd5395` test: add failing tests for structured note model helpers
   - `dfb4a5a` feat: move note model helpers to structured content

_Note: Both tasks were TDD tasks, so each has a RED test commit followed by a GREEN implementation commit._

## Files Created/Modified

- `src/features/apps/notes/notesContent.ts` - Defines structured content types, plain-text adapter helpers, text extraction, and strict parsing.
- `src/features/apps/notes/notesContent.test.ts` - Covers structured content conversion, extraction, and invalid parser shapes.
- `src/features/apps/notes/notesModel.ts` - Moves canonical note text to `content` and routes search/preview/body adapter helpers through structured text extraction.
- `src/features/apps/notes/notesModel.test.ts` - Covers structured content search, previews, body adapter text, and existing folder/title behavior.
- `.planning/phases/24-notes-structured-model-and-migration/24-01-SUMMARY.md` - Records this plan execution.

## Verification

- `bun run test -- src/features/apps/notes/notesContent.test.ts`
- `bun run test -- src/features/apps/notes/notesContent.test.ts src/features/apps/notes/notesModel.test.ts`
- `bun run build` after Task 1, before the model contract changed.
- Acceptance `rg` checks from the plan for exported content version, block variants, helper exports, forbidden content-module browser/storage APIs, canonical `Note.content`, `NoteInput.body`, structured extraction calls, and heading/checklist test coverage.

Full build was not rerun after Task 2 because Plan 24-01 intentionally changes the pure model contract before later Phase 24 plans update storage and UI integration. The plan-defined final verification surface is the focused Bun/Vitest suite above.

## Decisions Made

- Followed D-01 through D-04 and D-12 by keeping structured content as plain TypeScript data in a pure helper module.
- Preserved D-03 by keeping `NoteInput.body` as the current plain textarea adapter surface.
- Followed D-09 and D-10 by routing model search and previews through structured content text extraction.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - scanned modified source and test files for placeholder, TODO/FIXME, empty hardcoded UI data, and similar stub markers.

## Threat Flags

None - no new network endpoint, auth path, file access pattern, or unplanned trust boundary was introduced.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 24-02 can now migrate durable storage reads/writes to the structured v3 shape using `parseNoteContentDocument`, `createNoteContentFromPlainText`, and `getNoteBodyText` without adding editor UI behavior.

## Self-Check: PASSED

- Confirmed all created/modified files listed in this summary exist.
- Confirmed task commits `06c911f`, `cab9a80`, `2cd5395`, and `dfb4a5a` exist in git history.

---
*Phase: 24-notes-structured-model-and-migration*
*Completed: 2026-05-28*
