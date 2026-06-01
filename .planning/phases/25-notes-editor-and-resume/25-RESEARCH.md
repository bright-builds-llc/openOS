# Phase 25: Notes Editor And Resume - Research

**Researched:** 2026-05-31  
**Domain:** React/TypeScript local structured editor, localStorage-backed durable Notes data, and app-session resume state  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

Source: [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]

### Structured Editor Surface

- **D-01:** Keep the editor lightweight and iPhone-friendly: use explicit block controls for paragraph text, heading/section text, and checklist/list items instead of adopting a rich-text editor framework.
- **D-02:** The editing surface should operate directly on the Phase 24 typed content blocks (`paragraph`, `heading`, and `checklistItem`) while preserving the current title, folder, list, search, and local-only warning workflow.
- **D-03:** Existing plain paragraph notes must remain editable without a jarring migration prompt. A note created before this phase should open in the new editor with its paragraph content intact.
- **D-04:** New notes should start as an editable structured document, not as a legacy body textarea that is converted later.

### Checklist And List Content

- **D-05:** Checklist items are first-class editable blocks with text and checked state. Users can add, edit, toggle, and remove checklist items inside a local note.
- **D-06:** General list-like authoring can be represented through checklist/list block controls in this phase; attachments, nested lists, drag reordering, and collaboration are out of scope.
- **D-07:** Search and previews must continue using structured content text, including heading and checklist item labels, after users edit those blocks.

### Notes Resume State

- **D-08:** Notes resume state uses the canonical Phase 23 session key `openos.apps.notes.session`, separate from durable `openos.apps.notes.notes` data.
- **D-09:** Session state should capture disposable UI context only: selected folder, selected note, search text when meaningful, selected/editor-focused block, and enough edit context to reopen Notes without feeling like a fresh launch.
- **D-10:** If the saved folder, note, or block no longer exists, Notes should recover truthfully by selecting the nearest valid folder/note or showing the existing empty/selection state. It must not delete durable notes or folders.
- **D-11:** Malformed or unsupported Notes session snapshots should reset through the shared app-session helper and show safe default UI behavior.
- **D-12:** Storage write failures for session state should be handled truthfully and non-destructively. The durable note editing path must still remain separate from session persistence.

### Architecture And Verification

- **D-13:** Keep pure content-editing helpers in the Notes model/content layer. React components should call typed helpers rather than manually reshaping block arrays in event handlers.
- **D-14:** Keep side effects thin: durable note writes stay in `notesStorage.ts`, session read/write/reset behavior uses `appSessionStorage.ts`, and `NotesApp.tsx` owns rendering and UI events.
- **D-15:** Verification must include focused unit tests for structured block editing helpers, checklist toggling/editing, session parsing/fallbacks, and durable/session isolation.
- **D-16:** Browser-level tests must prove a user can create structured Notes content, toggle checklist/list content, navigate home or reload, reopen Notes, and resume the meaningful folder/note/editor context.

### the agent's Discretion

Source: [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]

- Exact control labels, iconography, and compact layout details are left to the agent as long as they stay consistent with the existing Notes app and small portrait iPhone constraints.
- The exact session payload type name and version number are flexible, but it must be app-owned, versioned, and parsed through the shared session helper.
- The implementation may split `NotesApp.tsx` into smaller components if doing so lowers risk and avoids growing the already-large app component.

### Deferred Ideas (OUT OF SCOPE)

Source: [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]

- Notes sync/accounts, account recovery, attachments, scans, collaboration, and locked notes remain out of scope for v1.3.
- Full rich-text editor framework adoption remains out of scope.
- Nested lists, drag-and-drop block reordering, images/files, and markdown import/export are future Notes capabilities.
- Browser tabs and Browser session restore belong to Phase 26.
- Cross-app app-state polish beyond Notes belongs to Phase 28.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NOTES-02 | User can create and edit structured local notes with headings or sections. [VERIFIED: .planning/REQUIREMENTS.md] | Add pure block helpers for `heading` and `paragraph`, add storage APIs that write `NoteContentDocument` directly, and replace the legacy body textarea with controlled block controls. [VERIFIED: src/features/apps/notes/notesContent.ts; src/features/apps/notes/notesStorage.ts; src/features/apps/notes/NotesApp.tsx] |
| NOTES-03 | User can create and update checklist or list content inside a local note. [VERIFIED: .planning/REQUIREMENTS.md] | Use the existing `checklistItem` block shape with text and checked state, then unit-test add/edit/toggle/remove helpers and browser-test checklist authoring. [VERIFIED: src/features/apps/notes/notesContent.ts; src/features/apps/notes/notesContent.test.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| NOTES-05 | User can return to Notes and resume the last meaningful folder, note, and edit context after navigating home or reloading. [VERIFIED: .planning/REQUIREMENTS.md] | Implement a Notes-owned session schema over `readAppSessionSnapshot` and `writeAppSessionSnapshot`, resolve stale ids against durable Notes state, and extend the existing launcher-path e2e flow with `returnHome` plus reload coverage. [VERIFIED: src/features/platform/appSessionStorage.ts; tests/e2e/fixtures/launcher.ts; tests/e2e/notes.spec.ts] |
</phase_requirements>

## Summary

Phase 25 should stay on the existing React/Vite/TypeScript/Bun stack and add no new editor dependency. The durable model already supports `paragraph`, `heading`, and `checklistItem`; the missing pieces are pure editing helpers, structured-content storage update APIs, compact block controls, and a Notes-specific session adapter over `openos.apps.notes.session`. [VERIFIED: package.json; src/features/apps/notes/notesContent.ts; src/features/apps/notes/notesStorage.ts; src/features/platform/appSessionStorage.ts]

The biggest planning risk is component growth. `NotesApp.tsx` is 687 lines, above the Bright Builds roughly-628-line file split trigger, and already owns folder, list, search, storage refresh, and editor rendering. Plan Phase 25 as at least two implementation slices: one pure model/storage/session slice with focused Vitest tests, then one UI/e2e slice that extracts editor/session pieces if needed. [VERIFIED: wc -l src/features/apps/notes/NotesApp.tsx; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md]

**Primary recommendation:** Use existing typed content blocks and the Phase 23 session helper; do not add a rich-text engine, markdown parser, sync surface, global state manager, or durable block-id migration in this phase. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; src/features/apps/notes/notesContent.ts; src/features/platform/appSessionStorage.ts]

## Project Constraints (from AGENTS.md)

- `AGENTS.md` is the repo-local entrypoint and directs agents to also read `AGENTS.bright-builds.md`, `standards-overrides.md`, and the relevant pinned Bright Builds standards pages before planning, review, implementation, or audit work. [VERIFIED: AGENTS.md; AGENTS.bright-builds.md]
- Managed Bright Builds files and managed blocks must not be edited directly; downstream customization belongs outside managed blocks or in `standards-overrides.md`. [VERIFIED: AGENTS.md; AGENTS.bright-builds.md]
- `standards-overrides.md` exists but contains only placeholder rows, so no active repo-specific standards exception applies to this phase. [VERIFIED: standards-overrides.md]
- Bright Builds requires functional core / imperative shell as the default architecture: pure data-in/data-out business logic should sit behind thin framework/storage adapters. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
- Bright Builds requires making illegal states unrepresentable when practical, parsing raw boundary data into domain types, and using `maybe` names for internal nullish values. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md; https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md; https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- Bright Builds treats functions over roughly 161 lines and files over roughly 628 lines as refactor triggers; `NotesApp.tsx` currently has 687 lines. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md; VERIFIED: wc -l src/features/apps/notes/NotesApp.tsx]
- Bright Builds requires pure and business logic to have focused unit tests, one concern per unit test, and clear Arrange/Act/Assert structure unless trivial. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md]
- Bright Builds requires relevant repo-native verification before commit and prefers aggregate repo-owned verification commands when available. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/verification.md]
- This repo is a Bun-friendly TypeScript/React app; new repo-owned automation should use TypeScript/JavaScript via Bun rather than adding Python scripts. [VERIFIED: package.json; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|-------------------|---------|---------|--------------|
| React / React DOM | `package.json` ranges `^19.2.4`; `bun.lock` resolves `19.2.5`; npm latest checked as `19.2.6`, published 2026-05-06. [VERIFIED: package.json; bun.lock; npm registry] | Controlled inputs, component state, and client effects for the Notes UI. [VERIFIED: src/features/apps/notes/NotesApp.tsx] | Existing app stack uses React components and controlled form fields; React docs require `value` plus synchronous `onChange` for controlled text areas. [VERIFIED: package.json; CITED: https://react.dev/reference/react-dom/components/textarea] |
| TypeScript | `package.json` range `^6.0.2`; `bun.lock` resolves `6.0.2`; npm latest checked as `6.0.3`, published 2026-04-16. [VERIFIED: package.json; bun.lock; npm registry] | Discriminated unions for block kinds, parser return types, and session payload typing. [VERIFIED: src/features/apps/notes/notesContent.ts; src/features/platform/appSessionStorage.ts] | Existing Notes content already models blocks as a TypeScript union and the session helper is generic over typed app payloads. [VERIFIED: src/features/apps/notes/notesContent.ts; src/features/platform/appSessionStorage.ts] |
| Vite + `@vitejs/plugin-react` | Vite range `^8.0.3`, lock `8.0.8`, npm latest `8.0.14` published 2026-05-21; plugin range/lock `6.0.1`, npm latest `6.0.2` published 2026-05-14. [VERIFIED: package.json; bun.lock; npm registry] | Build, dev server, production preview for Playwright. [VERIFIED: vite.config.ts; playwright.config.ts] | Project already uses Vite with React plugin; Playwright webServer builds and previews the Vite bundle on `127.0.0.1:42317`. [VERIFIED: vite.config.ts; playwright.config.ts] |
| Bun | `packageManager` declares `bun@1.3.9`; local CLI is `1.3.9`. [VERIFIED: package.json; local CLI probe] | Package manager and script runner for tests, build, and verification. [VERIFIED: package.json; scripts/verify-v1.3.sh] | Repo scripts and Bright Builds TS/JS guidance prefer the established Bun surface. [VERIFIED: package.json; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md] |
| Phase 24 Notes content model | `NoteContentDocument` version `1`; durable Notes storage version `3`. [VERIFIED: src/features/apps/notes/notesContent.ts; src/features/apps/notes/notesStorage.ts] | Canonical local note structure for paragraph, heading, and checklist blocks. [VERIFIED: src/features/apps/notes/notesContent.ts] | It is already the durable model and search/preview source; Phase 25 should edit it directly. [VERIFIED: src/features/apps/notes/notesModel.ts; src/features/apps/notes/notesStorage.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| Phase 23 app-session helper | Session envelope is `{ version, session }` under `createAppSessionStorageKey(namespace)`. [VERIFIED: src/features/platform/appSessionStorage.ts; src/features/platform/appStorage.ts] | Versioned, app-owned resume snapshots with reset/unavailable results. [VERIFIED: src/features/platform/appSessionStorage.ts] | User decisions require `openos.apps.notes.session`, malformed reset, write-failure reporting, and durable/session isolation. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; src/features/platform/appSessionStorage.test.ts] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|-------------------|---------|---------|-------------|
| Vitest | `package.json` range `^4.1.2`; `bun.lock` resolves `4.1.4`; npm latest checked as `4.1.7`, published 2026-05-20. [VERIFIED: package.json; bun.lock; npm registry] | Focused unit tests for pure content helpers, storage updates, and session parsing/fallbacks. [VERIFIED: vite.config.ts; scripts/verify-v1.3.sh] | Use for every pure helper and storage/session branch added in this phase; Vitest docs require Vite `>=6.0.0` and Node `>=20.0.0`, both satisfied locally. [CITED: https://vitest.dev/guide/; VERIFIED: local Node probe; package.json] |
| Playwright | `package.json` range `^1.59.1`; `bun.lock` and local CLI resolve `1.59.1`; npm latest checked as `1.60.0`, published 2026-05-11. [VERIFIED: package.json; bun.lock; local CLI probe; npm registry] | Browser-level WebKit iPhone regression for create/edit/checklist/resume flows. [VERIFIED: playwright.config.ts; tests/e2e/notes.spec.ts] | Extend the existing Notes e2e test and launcher fixture; Playwright docs support `getByTestId`, and the repo already uses `data-testid` heavily. [CITED: https://playwright.dev/docs/locators; VERIFIED: tests/e2e/notes.spec.ts; tests/e2e/fixtures/launcher.ts] |
| Web Storage API / `localStorage` | Browser API, no package version. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage] | Durable local Notes snapshots and disposable app-session snapshots. [VERIFIED: src/features/apps/notes/notesStorage.ts; src/features/platform/appSessionStorage.ts] | Keep using through existing helpers; MDN documents persistence across browser sessions and `SecurityError` cases, matching the repo's unavailable-state tests. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage; VERIFIED: src/features/platform/appSessionStorage.test.ts] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing typed block controls | TipTap, ProseMirror, Slate, Lexical, or another rich-text editor | Rejected for this phase by user decision; these would add schema/editor-engine complexity beyond headings/checklists/resume. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| Existing Phase 23 session helper | New React context/global store/Zustand/Redux | Rejected by user and prior phase decisions; session state must stay app-owned and durable data must stay separate. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| `NoteContentDocument` helpers | Markdown parser/import/export | Deferred; Phase 25 only needs explicit heading/checklist/list controls and searchable text. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| Index-based block focus | Durable block ids plus content document version bump | Avoid unless implementation explicitly plans a v2 content migration; current block parser accepts only exact keys and block shapes have no `id`, so adding durable ids would expand scope. [VERIFIED: src/features/apps/notes/notesContent.ts] |

**Installation:**

```bash
# No new packages recommended for Phase 25. [VERIFIED: package.json; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]
bun install
```

**Version verification:** Recommended existing package versions were checked against `package.json`, `bun.lock`, local CLIs, and `npm view` on 2026-05-31; no dependency upgrade is required to plan or execute this phase. [VERIFIED: package.json; bun.lock; npm registry; local CLI probes]

## Architecture Patterns

### Recommended Project Structure

```text
src/features/apps/notes/
├── notesContent.ts          # Pure content document, parser, and new block editing helpers. [VERIFIED: src/features/apps/notes/notesContent.ts]
├── notesModel.ts            # Pure presentation/resolution helpers for notes, folders, session validity, and previews. [VERIFIED: src/features/apps/notes/notesModel.ts]
├── notesStorage.ts          # Durable v3 storage and new structured-content create/update APIs. [VERIFIED: src/features/apps/notes/notesStorage.ts]
├── notesSession.ts          # New Notes-owned session parser/read/write/resolve wrapper over appSessionStorage. [VERIFIED: src/features/platform/appSessionStorage.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]
├── NotesApp.tsx             # React shell, app state wiring, and high-level layout. [VERIFIED: src/features/apps/notes/NotesApp.tsx]
├── NotesEditor.tsx          # Extracted block editor surface if implementation would otherwise grow NotesApp. [VERIFIED: wc -l src/features/apps/notes/NotesApp.tsx; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md]
└── notes.css                # Existing visual system extended for compact block controls. [VERIFIED: src/features/apps/notes/notes.css]
```

### Pattern 1: Pure Block Editing Helpers

**What:** Add helper functions that accept a `NoteContentDocument` and return a new document plus any next selection/focus index needed by the UI. [VERIFIED: src/features/apps/notes/notesContent.ts; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]  
**When to use:** Every block add, text edit, checklist toggle, and remove action should call these helpers instead of mutating `content.blocks` in `NotesApp.tsx`. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]

**Example:**

```typescript
// Source: existing NoteContentDocument/NoteContentBlock shape in notesContent.ts.
export function updateNoteContentBlockText(
  content: NoteContentDocument,
  blockIndex: number,
  text: string,
): NoteContentDocument {
  if (blockIndex < 0 || blockIndex >= content.blocks.length) {
    return content;
  }

  return {
    ...content,
    blocks: content.blocks.map((block, index) =>
      index === blockIndex ? { ...block, text } : block,
    ),
  };
}
```

### Pattern 2: Structured Storage API, Body Adapter Preserved

**What:** Add content-aware storage entrypoints such as `createStoredNoteFromContent` or `updateStoredNoteContent` while keeping the current `body` adapter for compatibility tests and old call sites. [VERIFIED: src/features/apps/notes/notesStorage.ts; .planning/phases/24-notes-structured-model-and-migration/24-03-SUMMARY.md]  
**When to use:** New Phase 25 UI edits should pass `NoteContentDocument` directly; legacy body paths can remain until no caller uses them. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; src/features/apps/notes/NotesApp.tsx]

**Example:**

```typescript
// Source: notesStorage.ts already normalizes and writes version-3 snapshots.
type StructuredNoteInput = {
  title: string;
  content: NoteContentDocument;
  folderId: string;
};

export function createStoredNoteFromContent(
  storage: StorageLike,
  namespace: string,
  input: StructuredNoteInput,
  maybeOptions?: { now?: () => string },
): Note {
  const snapshot = readSnapshot(storage, namespace);
  const timestamp = maybeOptions?.now?.() ?? new Date().toISOString();
  const nextNote: Note = {
    id: crypto.randomUUID(),
    title: input.title,
    content: input.content,
    folderId: resolveFolderId(snapshot.folders, input.folderId),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeSnapshot(storage, namespace, {
    ...snapshot,
    notes: [nextNote, ...snapshot.notes],
  });

  return nextNote;
}
```

The planner should pair this creation path with an `updateStoredNoteContent` path; do not implement structured edits by serializing content through `body` text because that would erase heading/checklist semantics. [VERIFIED: src/features/apps/notes/notesStorage.ts; src/features/apps/notes/notesContent.ts]

### Pattern 3: Notes-Owned Session Adapter

**What:** Create a small Notes adapter that owns `NotesSession`, `parseNotesSession`, `readNotesSession`, `writeNotesSession`, and `resolveNotesSessionAgainstState`. [VERIFIED: src/features/platform/appSessionStorage.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]  
**When to use:** On initial Notes mount, read durable Notes state and session state, resolve stale folder/note/block references, then initialize React state from the resolved result. [VERIFIED: src/features/apps/notes/NotesApp.tsx; src/features/platform/appSessionStorage.ts]

**Example:**

```typescript
// Source: appSessionStorage.ts generic snapshot contract.
type NotesSession = {
  selectedFolderId: string;
  selectedNoteId: string | null;
  searchQuery: string;
  selectedBlockIndex: number | null;
};

const NOTES_SESSION_VERSION = 1;

export function readNotesSession(storage: AppSessionStorageLike) {
  return readAppSessionSnapshot(storage, NOTES_NAMESPACE, {
    version: NOTES_SESSION_VERSION,
    defaultSession: createDefaultNotesSession(),
    parseSession: parseNotesSession,
  });
}
```

### Pattern 4: Resolve Stale Session Truthfully

**What:** Treat session ids and block indexes as hints, not authority; resolve them against current folders, filtered notes, selected note content, and search state before rendering. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; src/features/apps/notes/NotesApp.tsx]  
**When to use:** Every session read, note deletion, folder change, search restore, and block deletion path should use the same resolver. [VERIFIED: src/features/apps/notes/NotesApp.tsx; src/features/apps/notes/notesModel.ts]

**Example:**

```typescript
// Source: existing resolveSelectedFolderId pattern in NotesApp.tsx.
export function resolveSelectedBlockIndex(
  note: Note | null,
  maybeBlockIndex: number | null,
): number | null {
  if (note === null || maybeBlockIndex === null) {
    return null;
  }

  if (note.content.blocks.length === 0) {
    return null;
  }

  return Math.min(
    Math.max(0, maybeBlockIndex),
    note.content.blocks.length - 1,
  );
}
```

### Anti-Patterns to Avoid

- **Editing raw block arrays in React event handlers:** This duplicates parsing and invalid-index behavior in the UI shell; put it in pure helpers. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
- **Converting every structured edit through plain body text:** This would discard heading/checklist semantics and break NOTES-02/NOTES-03. [VERIFIED: src/features/apps/notes/notesStorage.ts; src/features/apps/notes/notesContent.ts]
- **Reading session after first paint and then overriding UI state:** React effects run after mount and can re-run during development stress tests; initial session resolution should happen in lazy state setup or a single adapter initializer to avoid visible fresh-launch flicker. [CITED: https://react.dev/reference/react/useEffect; VERIFIED: src/features/apps/notes/NotesApp.tsx]
- **Using auth-session thinking for app-session state:** `openos.apps.notes.session` is disposable UI context, not authentication or authorization state. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md; src/features/platform/appSessionStorage.ts]
- **Growing `NotesApp.tsx` without extraction:** The file is already over the Bright Builds split trigger, so editor-specific rendering and session helpers should move out when practical. [VERIFIED: wc -l src/features/apps/notes/NotesApp.tsx; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text editing | Custom selection/caret engine, HTML sanitizer, rich paste pipeline, markdown importer, nested list tree | Existing typed blocks plus native controlled inputs/checklists | User decisions explicitly defer full rich text, nested lists, import/export, and attachments. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| Session storage contract | New localStorage envelope or global state package | `readAppSessionSnapshot`, `writeAppSessionSnapshot`, `resetAppSessionSnapshot` | Phase 23 already supplies versioning, reset status, exact `.session` key writes, and unavailable status. [VERIFIED: src/features/platform/appSessionStorage.ts; src/features/platform/appSessionStorage.test.ts] |
| Search index | Custom index/cache for blocks | Existing `getNoteContentText`, `filterNotes`, and `getNotePreview` | Search and previews already traverse structured content including headings and checklist labels. [VERIFIED: src/features/apps/notes/notesModel.ts; src/features/apps/notes/notesModel.test.ts] |
| Durable migration | New v4 storage migration just for editor focus | Existing v3 durable model plus disposable session index/focus hints | Current blocks have no ids and strict parser shapes; a durable block-id migration is larger than the Phase 25 resume requirement. [VERIFIED: src/features/apps/notes/notesContent.ts; src/features/apps/notes/notesStorage.ts] |
| Browser navigation testing | Ad hoc DOM clicks and CSS selectors | Existing `gotoInstalledContextMode`, `openApp`, `returnHome`, `waitForHomeScreen`, and `getByTestId` | The repo already has launcher fixtures and Playwright recommends test ids for resilient tests when user-facing locators are not the target. [VERIFIED: tests/e2e/fixtures/launcher.ts; CITED: https://playwright.dev/docs/locators] |

**Key insight:** The hard parts are not editor algorithms; they are preserving typed content semantics, resolving stale disposable session hints truthfully, and proving durable/session isolation while the app component grows a richer UI. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; src/features/apps/notes/notesContent.ts; src/features/platform/appSessionStorage.ts]

## Common Pitfalls

### Pitfall 1: Losing Structure Through the Plain-Text Adapter

**What goes wrong:** Updating a heading/checklist note through `updateStoredNote(..., { body })` converts content back to a single paragraph. [VERIFIED: src/features/apps/notes/notesStorage.ts]  
**Why it happens:** Phase 24 intentionally kept `NoteInput.body` for the old textarea; Phase 25 must add a direct content update path. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-03-SUMMARY.md]  
**How to avoid:** Plan a storage/model task before UI work that writes `NoteContentDocument` directly and tests heading/checklist persistence. [VERIFIED: src/features/apps/notes/notesStorage.test.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]  
**Warning signs:** Durable snapshots after editing contain only one paragraph block or checklist `checked` state disappears. [VERIFIED: src/features/apps/notes/notesContent.ts; tests/e2e/notes.spec.ts]

### Pitfall 2: Treating Saved Session Selection as Always Valid

**What goes wrong:** A deleted folder, filtered-out note, or removed block leaves the UI pointing at missing data. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]  
**Why it happens:** Session state is disposable and can outlive durable edits, deletes, search changes, or malformed snapshots. [VERIFIED: src/features/platform/appSessionStorage.ts; src/features/apps/notes/NotesApp.tsx]  
**How to avoid:** Resolve folder, note, and block focus through pure helpers every time session data is read or durable data changes. [VERIFIED: src/features/apps/notes/NotesApp.tsx; src/features/apps/notes/notesModel.ts]  
**Warning signs:** E2E reload opens Notes with no selected note despite matching notes, or errors when a block index is out of range. [VERIFIED: tests/e2e/notes.spec.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]

### Pitfall 3: Session Write Failures Masquerading as Success

**What goes wrong:** UI claims resume will work even when localStorage writes are blocked or quota-limited. [VERIFIED: src/features/platform/appSessionStorage.ts; src/features/platform/appSessionStorage.test.ts]  
**Why it happens:** Writing directly to `localStorage.setItem` bypasses the helper's `unavailable` result. [VERIFIED: src/features/platform/appSessionStorage.ts]  
**How to avoid:** All Notes session writes should use `writeAppSessionSnapshot`; store a small status for truthful UI copy while keeping durable note edits separate. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; src/features/platform/appSessionStorage.ts]  
**Warning signs:** New code calls `localStorage.setItem("openos.apps.notes.session", ...)` directly or catches storage errors without surfacing status. [VERIFIED: src/features/platform/appSessionStorage.ts; rg localStorage/session checks]

### Pitfall 4: Focus and Controlled Input Churn

**What goes wrong:** Text entry jumps, inputs become read-only, or block focus resets on every keystroke. [CITED: https://react.dev/reference/react-dom/components/textarea]  
**Why it happens:** Controlled form fields require a stable string value and synchronous `onChange`; React also remounts children if component definitions or keys change every render. [CITED: https://react.dev/reference/react-dom/components/textarea]  
**How to avoid:** Keep block editor components stable, use deterministic keys, update note content synchronously from `event.target.value`, and persist session focus as a side effect after state changes. [CITED: https://react.dev/reference/react-dom/components/textarea; VERIFIED: src/features/apps/notes/NotesApp.tsx]  
**Warning signs:** Playwright typing enters only one character, title/body values lag, or selected block focus disappears after each block edit. [CITED: https://react.dev/reference/react-dom/components/textarea; VERIFIED: tests/e2e/notes.spec.ts]

### Pitfall 5: Overloading the Existing Local-Only Warning

**What goes wrong:** Users cannot distinguish "notes are local only" from "resume state could not be saved." [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md; src/features/apps/notes/NotesApp.tsx]  
**Why it happens:** Phase 25 adds a second storage status, but durable note editing and disposable session persistence are separate concerns. [VERIFIED: src/features/platform/appSessionStorage.ts; src/features/apps/notes/notesStorage.ts]  
**How to avoid:** Preserve the existing local-only warning and add a compact session-specific unavailable/reset notice only when the helper reports it. [VERIFIED: src/features/platform/appSessionStorage.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]  
**Warning signs:** Session reset copy sounds like notes were deleted, or durable note saves are blocked because session writes fail. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]

## Code Examples

### Checklist Toggle Helper

```typescript
// Source: checklistItem block shape in notesContent.ts.
export function toggleChecklistItemBlock(
  content: NoteContentDocument,
  blockIndex: number,
): NoteContentDocument {
  const maybeBlock = content.blocks[blockIndex];

  if (maybeBlock?.kind !== "checklistItem") {
    return content;
  }

  return {
    ...content,
    blocks: content.blocks.map((block, index) =>
      index === blockIndex
        ? { ...block, checked: !block.checked }
        : block,
    ),
  };
}
```

### Notes Session Parser

```typescript
// Source: appSessionStorage.ts parser contract and existing parse patterns.
function parseNotesSession(
  maybeSession: unknown,
): NotesSession | null {
  if (!isRecord(maybeSession)) {
    return null;
  }

  if (
    typeof maybeSession.selectedFolderId !== "string" ||
    (maybeSession.selectedNoteId !== null &&
      typeof maybeSession.selectedNoteId !== "string") ||
    typeof maybeSession.searchQuery !== "string" ||
    (maybeSession.selectedBlockIndex !== null &&
      (!Number.isInteger(maybeSession.selectedBlockIndex) ||
        maybeSession.selectedBlockIndex < 0))
  ) {
    return null;
  }

  return {
    selectedFolderId: maybeSession.selectedFolderId,
    selectedNoteId: maybeSession.selectedNoteId,
    searchQuery: maybeSession.searchQuery,
    selectedBlockIndex: maybeSession.selectedBlockIndex,
  };
}
```

### Browser Resume Test Shape

```typescript
// Source: existing tests/e2e/notes.spec.ts and tests/e2e/fixtures/launcher.ts.
await page.getByTestId("notes-add-heading").click();
await page.getByTestId("notes-block-input:0").fill("Trip plan");
await page.getByTestId("notes-add-checklist-item").click();
await page.getByTestId("notes-block-input:1").fill("Pack charger");
await page.getByTestId("notes-block-check:1").check();

await returnHome(page, "notes");
await openApp(page, "notes");

await expect(page.getByTestId("notes-title-input")).toHaveValue("Packing");
await expect(page.getByTestId("notes-block-input:0")).toHaveValue("Trip plan");
await expect(page.getByTestId("notes-block-check:1")).toBeChecked();
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Notes UI stored body text through a plain textarea adapter. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-03-SUMMARY.md] | Phase 25 should render and persist typed blocks directly. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] | Phase 24 created the model on 2026-05-28; Phase 25 is the editor phase. [VERIFIED: .planning/STATE.md; Phase 24 summaries] | Plans must add content-aware storage/update paths before replacing the editor UI. [VERIFIED: src/features/apps/notes/notesStorage.ts] |
| App-specific UI state lived only in React state. [VERIFIED: src/features/apps/notes/NotesApp.tsx] | Disposable app-session snapshots use exact canonical keys like `openos.apps.notes.session`. [VERIFIED: src/features/platform/appStorage.ts; src/features/platform/appSessionStorage.ts] | Phase 23 completed 2026-05-27. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-01-SUMMARY.md] | Notes resume should use the shared helper and must not touch durable `openos.apps.notes.notes`. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| Browser e2e only proved Notes persistence/search after reload. [VERIFIED: tests/e2e/notes.spec.ts] | Phase 25 e2e must also prove structured editing, checklist toggling, home navigation resume, and reload resume. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] | Phase 25 planning. [VERIFIED: .planning/ROADMAP.md] | Extend the existing Notes test rather than adding a separate browser harness. [VERIFIED: tests/e2e/fixtures/launcher.ts] |

**Deprecated/outdated:**

- Using `body` as the only editable note content path is outdated for Phase 25 because it cannot preserve headings and checklist checked state. [VERIFIED: src/features/apps/notes/notesStorage.ts; src/features/apps/notes/notesContent.ts]
- Treating `openos.apps.notes.session` as durable user data is invalid because Phase 23 defines app-session snapshots as disposable UI context. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| — | No claims were intentionally left as `[ASSUMED]`; planning recommendations are tied to verified code, user decisions, or cited docs. | — | — |

## Open Questions (RESOLVED)

1. **RESOLVED: Should block resume include exact caret offset or only selected block?**  
   - What we know: User decisions require selected/editor-focused block and enough edit context, not exact text selection offsets. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]  
   - Resolution: Phase 25 resumes the selected/focused block index only. Exact caret offset persistence is not required for this phase and should be added later only if UAT explicitly asks for it. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md]
   - Plan impact: Current plans already implement `selectedBlockIndex`-only resume and do not need a plan rewrite. [VERIFIED: .planning/phases/25-notes-editor-and-resume/25-01-PLAN.md; .planning/phases/25-notes-editor-and-resume/25-02-PLAN.md; .planning/phases/25-notes-editor-and-resume/25-03-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Repo scripts and verification | Yes [VERIFIED: local CLI probe] | `1.3.9` [VERIFIED: local CLI probe] | Install Bun matching `packageManager` if absent. [VERIFIED: package.json] |
| Node.js | npm version checks and tooling substrate | Yes [VERIFIED: local CLI probe] | `v24.13.0` [VERIFIED: local CLI probe] | Use Bun scripts for project commands; Node is already above Vitest's documented minimum. [CITED: https://vitest.dev/guide/] |
| Git | Status/history and optional docs commit | Yes [VERIFIED: local CLI probe] | `2.53.0` [VERIFIED: local CLI probe] | None needed. [VERIFIED: local CLI probe] |
| Playwright CLI | WebKit iPhone e2e verification | Yes [VERIFIED: local CLI probe] | `1.59.1` [VERIFIED: local CLI probe; bun.lock] | If browsers are missing during execution, run the repo/Playwright install path before e2e. [VERIFIED: playwright.config.ts] |
| npm registry access | Version verification only | Yes [VERIFIED: npm view commands] | npm returned current package metadata on 2026-05-31. [VERIFIED: npm registry] | Not required for implementation if no dependency changes occur. [VERIFIED: package.json] |

**Missing dependencies with no fallback:** None found during research. [VERIFIED: local CLI probes]

**Missing dependencies with fallback:** Playwright browser binaries were not separately launched during research; `bun run verify:v1.3` or the focused e2e command will prove them during implementation. [VERIFIED: playwright.config.ts]

## Security Domain

OWASP states ASVS provides a basis for testing web application technical security controls and lists 5.0.0 as the latest stable version on the checked project page; the table below maps the GSD template categories to this phase's actual local-only Notes scope. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No | No accounts, login, sync, credentials, or identity recovery are in scope. [VERIFIED: .planning/REQUIREMENTS.md; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| V3 Session Management | Partial | Treat Notes app-session as disposable UI context only; use `appSessionStorage.ts`, not auth cookies or tokens. [VERIFIED: src/features/platform/appSessionStorage.ts; .planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md] |
| V4 Access Control | No | This phase has no multi-user backend or authorization boundary; do not add one. [VERIFIED: .planning/PROJECT.md; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |
| V5 Input Validation | Yes | Parse raw localStorage snapshots through strict parsers and render user note text through React text/value props, not raw HTML. [VERIFIED: src/features/apps/notes/notesContent.ts; src/features/platform/appSessionStorage.ts; rg dangerouslySetInnerHTML check] |
| V6 Cryptography | No | Do not add encryption or secret-handling claims; local-only Notes and session data remain unencrypted browser storage in this milestone. [VERIFIED: .planning/PROJECT.md; .planning/REQUIREMENTS.md] |

### Known Threat Patterns for React Local Notes

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed or unsupported session snapshot | Tampering | Use `readAppSessionSnapshot` so malformed JSON, unsupported versions, and invalid payloads reset to default or report unavailable. [VERIFIED: src/features/platform/appSessionStorage.ts; src/features/platform/appSessionStorage.test.ts] |
| Broad storage deletion while resetting session | Tampering | Use exact `openos.apps.notes.session` reset/write helpers and prove durable `openos.apps.notes.notes` remains intact. [VERIFIED: src/features/platform/appStorage.ts; src/features/apps/notes/notesStorage.test.ts] |
| XSS through note text rendered as HTML | Elevation of privilege | Keep note content in controlled inputs/text nodes and avoid `dangerouslySetInnerHTML`; current Notes/platform searched files have no unsafe HTML rendering matches. [VERIFIED: rg dangerouslySetInnerHTML/innerHTML check; CITED: https://react.dev/reference/react-dom/components/textarea] |
| Storage unavailable or write failure | Repudiation / Denial of service | Surface `unavailable` from `writeAppSessionSnapshot` for session writes while durable note editing remains separate. [VERIFIED: src/features/platform/appSessionStorage.ts; .planning/phases/25-notes-editor-and-resume/25-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/25-notes-editor-and-resume/25-CONTEXT.md` - locked Phase 25 decisions, discretion, deferred scope, and canonical refs. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/PROJECT.md`, `.planning/STATE.md` - v1.3 requirements, Phase 25 scope, project constraints, and current state. [VERIFIED: file read]
- Phase 23 and 24 context/summary files - app-session contract, durable/session isolation, structured model, v3 storage, and plain-text adapter history. [VERIFIED: file read]
- `src/features/apps/notes/notesContent.ts`, `notesModel.ts`, `notesStorage.ts`, `NotesApp.tsx`, `notes.css` - current Notes model/storage/UI state. [VERIFIED: file read]
- `src/features/platform/appStorage.ts`, `appSessionStorage.ts`, and tests - canonical session key and helper behavior. [VERIFIED: file read]
- `tests/e2e/notes.spec.ts`, `tests/e2e/fixtures/launcher.ts`, `playwright.config.ts`, `scripts/verify-v1.3.sh` - browser flow and verification entrypoint. [VERIFIED: file read]
- `package.json`, `bun.lock`, local CLI probes, and `npm view` commands - package manager, installed versions, and npm latest/publish metadata. [VERIFIED: package.json; bun.lock; local CLI; npm registry]
- Pinned Bright Builds standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676` - architecture, code shape, verification, testing, and TypeScript/JavaScript rules. [CITED: raw.githubusercontent.com Bright Builds pages]

### Secondary (MEDIUM confidence)

- React docs for controlled `<textarea>`, `useEffect`, and `useDeferredValue`; Playwright locator docs; Vitest guide; MDN localStorage docs; OWASP ASVS project page. [CITED: react.dev; playwright.dev; vitest.dev; developer.mozilla.org; owasp.org]

### Tertiary (LOW confidence)

- None. [VERIFIED: source review]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - repo package files, lockfile, local CLI probes, and npm registry metadata all agree on the existing stack; no new packages are recommended. [VERIFIED: package.json; bun.lock; npm registry; local CLI probes]
- Architecture: HIGH - Phase 23/24 decisions and current code establish the pure helper/storage/session boundaries needed for Phase 25. [VERIFIED: Phase 23/24 context and summaries; source files]
- Pitfalls: HIGH - identified pitfalls map directly to current code paths, prior tests, React docs, and Phase 25 user decisions. [VERIFIED: source files; tests; CITED: React docs]

**Research date:** 2026-05-31  
**Valid until:** 2026-06-30 for codebase-specific architecture; package/version freshness should be rechecked after 2026-06-07 because npm packages are moving quickly. [VERIFIED: npm registry modified dates]
