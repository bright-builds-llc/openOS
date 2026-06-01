---
phase: 25-notes-editor-and-resume
reviewed: 2026-06-01T01:15:30Z
depth: standard
files_reviewed: 14
files_reviewed_list:
  - src/features/apps/notes/NotesApp.tsx
  - src/features/apps/notes/NotesEditor.tsx
  - src/features/apps/notes/notes.css
  - src/features/apps/notes/notesContent.ts
  - src/features/apps/notes/notesContent.test.ts
  - src/features/apps/notes/notesSession.ts
  - src/features/apps/notes/notesSession.test.ts
  - src/features/apps/notes/notesStorage.ts
  - src/features/apps/notes/notesStorage.test.ts
  - tests/e2e/notes.spec.ts
  - tests/e2e/app-integration.spec.ts
  - tests/e2e/distribution-integration.spec.ts
  - tests/e2e/readme-media.spec.ts
  - scripts/verify-v1.3.sh
findings:
  critical: 0
  warning: 2
  info: 1
  total: 3
status: issues_found
---

# Phase 25: Code Review Report

**Reviewed:** 2026-06-01T01:15:30Z
**Depth:** standard
**Files Reviewed:** 14
**Status:** issues_found

## Summary

Reviewed the Notes editor, structured content/session/storage modules, related unit and Playwright coverage, and the v1.3 verification script. This review was informed by the repo-local `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and the pinned Bright Builds standards for architecture, code shape, verification, testing, and TypeScript/JavaScript. No repo-local `.claude/skills/` or `.agents/skills/` directories were present.

The pure note-content and session logic is well covered by focused tests, and targeted verification passed. The remaining concerns are at the browser storage boundary, where corrupted or unavailable local storage can still crash the app, plus one maintainability issue from an oversized React module.

Verification performed:

- `bun run test -- src/features/apps/notes/notesContent.test.ts src/features/apps/notes/notesStorage.test.ts src/features/apps/notes/notesSession.test.ts` passed: 3 files, 48 tests.
- `bun x tsc --noEmit` passed.
- `bash -n scripts/verify-v1.3.sh` passed.

## Warnings

### WR-01: Invalid Stored Timestamps Can Crash The Notes Editor

**File:** `src/features/apps/notes/notesStorage.ts:84`
**Issue:** Stored notes only validate `createdAt` and `updatedAt` as strings. A corrupted localStorage payload with `updatedAt: "not-a-date"` passes parsing, then `NotesApp` formats it through `Intl.DateTimeFormat.format(new Date(timestamp))`, which throws `RangeError: Invalid time value`. Because localStorage is a user-controlled persistence boundary, one bad timestamp can make Notes fail to render instead of dropping or repairing the bad note.
**Fix:** Validate timestamp strings while parsing storage payloads, or make the display formatter tolerate invalid dates before rendering.

```ts
function maybeParseTimestamp(maybeValue: unknown): string | null {
  if (typeof maybeValue !== "string") {
    return null;
  }

  return Number.isNaN(Date.parse(maybeValue)) ? null : maybeValue;
}

const maybeUpdatedAt = maybeParseTimestamp(maybeValue.updatedAt);
if (maybeUpdatedAt === null) {
  return null;
}
```

Also add a regression test that seeds a version 3 note with an invalid `updatedAt` and verifies the note is rejected or rendered with a safe fallback.

### WR-02: Durable Notes Storage Failures Are Unhandled

**File:** `src/features/apps/notes/notesStorage.ts:283`
**Issue:** Durable Notes reads and writes call `storage.getItem`, `storage.setItem`, and `storage.removeItem` without catching browser storage exceptions. If localStorage is disabled, blocked, or quota-limited, opening Notes or editing content can throw through React event/render paths. Session storage already returns explicit unavailable results; durable Notes storage needs the same boundary handling.
**Fix:** Wrap durable storage I/O in result-returning helpers and surface an unavailable state in `NotesApp` instead of returning a note that may not have been persisted.

```ts
type NotesStorageWriteResult =
  | { status: "saved" }
  | { status: "unavailable"; error: unknown };

function writeSnapshot(
  storage: StorageLike,
  namespace: string,
  maybeSnapshot: NotesSnapshot,
): NotesStorageWriteResult {
  try {
    const snapshot = normalizeSnapshot(maybeSnapshot);
    storage.setItem(getNotesStorageKey(namespace), JSON.stringify(snapshot));
    return { status: "saved" };
  } catch (error) {
    return { status: "unavailable", error };
  }
}
```

Extend create/update/delete callers to avoid updating UI selection as though the write succeeded when storage reports `unavailable`.

## Info

### IN-01: NotesApp Exceeds The Bright Builds Refactor Triggers

**File:** `src/features/apps/notes/NotesApp.tsx:257`
**Issue:** `NotesApp` is roughly 595 lines inside one component, and the file is 852 lines. Bright Builds treats functions over roughly 161 lines and files over roughly 628 lines as refactor triggers. This is not currently a correctness defect, but it concentrates storage orchestration, session restoration, folder composition, list rendering, and editor rendering in one module, making future storage-state fixes riskier.
**Fix:** Split along existing responsibilities: a session/storage hook, folder toolbar/list components, and an editor shell component. Keep pure decisions in `notesContent`, `notesSession`, or small helpers with unit tests.

---

_Reviewed: 2026-06-01T01:15:30Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
