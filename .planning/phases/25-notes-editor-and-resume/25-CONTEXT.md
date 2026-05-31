---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 25-2026-05-31T23-52-26
generated_at: 2026-05-31T23:52:29.451Z
---

# Phase 25: Notes Editor And Resume - Context

**Gathered:** 2026-05-31
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Phase 25 adds visible structured editing affordances to the existing local Notes app and persists meaningful disposable Notes UI context. Users should be able to create and edit headings/sections plus checklist or list content inside local notes, then return to Notes after home navigation or reload and recover the last meaningful folder, note, search/edit position, and selected editor context. This phase must build on the Phase 24 structured content model and Phase 23 app-session contract without adding sync/accounts, attachments, collaboration, locked notes, a rich-text editor framework, or a new global state manager.

</domain>

<decisions>
## Implementation Decisions

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

- Exact control labels, iconography, and compact layout details are left to the agent as long as they stay consistent with the existing Notes app and small portrait iPhone constraints.
- The exact session payload type name and version number are flexible, but it must be app-owned, versioned, and parsed through the shared session helper.
- The implementation may split `NotesApp.tsx` into smaller components if doing so lowers risk and avoids growing the already-large app component.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone And Requirements

- `.planning/ROADMAP.md` — Phase 25 boundary, dependency on Phase 24, requirements, UI hint, and success criteria.
- `.planning/REQUIREMENTS.md` — `NOTES-02`, `NOTES-03`, and `NOTES-05` requirements mapped to Phase 25.
- `.planning/PROJECT.md` — project constraints, current milestone goal, key decisions, and out-of-scope boundaries.
- `.planning/STATE.md` — current v1.3 progress and Phase 25 planning position.

### Prior Phase Decisions

- `.planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md` — locked app-session storage contract, durable/session isolation, and no-global-state decisions.
- `.planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md` — locked structured Notes model, no rich-text framework, search/preview, and durable migration decisions.
- `.planning/phases/24-notes-structured-model-and-migration/24-01-SUMMARY.md` — structured content model and search/preview helpers delivered by Phase 24.
- `.planning/phases/24-notes-structured-model-and-migration/24-02-SUMMARY.md` — durable Notes v3 migration and storage safety delivered by Phase 24.
- `.planning/phases/24-notes-structured-model-and-migration/24-03-SUMMARY.md` — plain-text app adapter and `verify:v1.3` coverage delivered by Phase 24.

### Notes And Session Code

- `src/features/apps/notes/notesContent.ts` — current typed content document and block parser.
- `src/features/apps/notes/notesModel.ts` — current pure Notes presentation helpers and `NoteInput` shape.
- `src/features/apps/notes/notesStorage.ts` — durable Notes v3 storage, creation, update, deletion, and migration path.
- `src/features/apps/notes/NotesApp.tsx` — current visible Notes app, folder/search/list/editor state, and plain-text editor UI.
- `src/features/apps/notes/notes.css` — current Notes layout, controls, list, and editor styling.
- `src/features/platform/appSessionStorage.ts` — shared app-session read/write/reset helper and error statuses.
- `src/features/platform/appStorage.ts` — canonical Notes durable and session storage key helpers.
- `src/features/runtime/appRegistry.ts` — canonical Notes runtime app and storage namespace lookup.

### Verification

- `src/features/apps/notes/notesContent.test.ts` — current content parser/text extraction tests to extend for block editing helpers.
- `src/features/apps/notes/notesModel.test.ts` — current Notes search/preview/body adapter tests.
- `src/features/apps/notes/notesStorage.test.ts` — current durable Notes storage, migration, and durable/session isolation tests.
- `src/features/platform/appSessionStorage.test.ts` — session helper behavior and write/reset failure patterns.
- `tests/e2e/notes.spec.ts` — current browser-level Notes persistence, search, folders, and reload regression.
- `scripts/verify-v1.3.sh` — canonical v1.3 verification command to keep green and extend only when needed.
- `package.json` — Bun script surface and existing verification commands.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `notesContent.ts` already defines the supported block kinds for this phase: `paragraph`, `heading`, and `checklistItem`.
- `getNoteContentText`, `getNotePreview`, and `filterNotes` already treat structured content as searchable and previewable text.
- `notesStorage.ts` already writes v3 durable snapshots without legacy `body` fields and centralizes `createStoredNote`, `updateStoredNote`, and `deleteStoredNote`.
- `appSessionStorage.ts` already provides versioned session parsing, exact-key writes, reset behavior, and unavailable statuses for session storage failures.
- The existing Notes e2e flow already covers installed-mode launch, folder creation, note creation, search, reload, and reopen paths.

### Established Patterns

- Notes is local-first and must keep the no-sync/account-recovery warning visible.
- Durable user-authored Notes data and disposable app-session state are separate keys and must remain isolated.
- Existing tests use Vitest with Arrange/Act/Assert comments for meaningful unit behavior.
- The repo uses Bun, React 19, Vite, TypeScript, Vitest, and Playwright; no new runtime editor dependency is justified.
- The current Notes component is large enough that any editor expansion should either extract focused subcomponents/helpers or remain very carefully scoped.

### Integration Points

- Add pure block editing helpers near `notesContent.ts` or `notesModel.ts` so storage and UI updates can share one typed path.
- Extend `NoteInput` or add structured update input APIs so new block-based edits do not keep flowing through plain `body` conversion.
- Add Notes-specific session parsing and read/write calls in or near the Notes app boundary using `openos.apps.notes.session`.
- Extend the Notes app UI around the existing editor panel, preserving current folder/search/list behavior and small-screen density.
- Extend `verify:v1.3` only with focused Phase 25 test files if the existing command surface does not already cover them.

</code_context>

<specifics>
## Specific Ideas

- Treat heading/section editing as a simple block-level authoring tool, not as full rich text.
- Checklist authoring should feel direct: add item, type item text, toggle checked state, and keep the item searchable.
- Resume state should make Notes feel persistent after home navigation or reload, but it should remain disposable and safe to reset.
- Favor compact controls and predictable form elements over decorative editor chrome.

</specifics>

<deferred>
## Deferred Ideas

- Notes sync/accounts, account recovery, attachments, scans, collaboration, and locked notes remain out of scope for v1.3.
- Full rich-text editor framework adoption remains out of scope.
- Nested lists, drag-and-drop block reordering, images/files, and markdown import/export are future Notes capabilities.
- Browser tabs and Browser session restore belong to Phase 26.
- Cross-app app-state polish beyond Notes belongs to Phase 28.

</deferred>

---

*Phase: 25-notes-editor-and-resume*
*Context gathered: 2026-05-31*
