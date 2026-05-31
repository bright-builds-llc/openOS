# Phase 25: Notes Editor And Resume - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-31T23:52:29.451Z
**Phase:** 25-notes-editor-and-resume
**Mode:** Yolo
**Areas discussed:** Structured Editor Surface, Checklist And List Content, Notes Resume State, Architecture And Verification

---

## Structured Editor Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Lightweight block controls | Use explicit paragraph, heading, and checklist controls on top of the Phase 24 block model. | yes |
| Rich-text editor framework | Add a full editor dependency and content engine. | no |
| Keep textarea only | Continue converting all edits through the plain body adapter. | no |

**User's choice:** Auto-selected lightweight block controls as the recommended default.
**Notes:** This follows Phase 24's explicit decision to defer rich-text framework adoption while making the structured model user-editable in Phase 25.

---

## Checklist And List Content

| Option | Description | Selected |
|--------|-------------|----------|
| First-class checklist blocks | Add, edit, toggle, and remove checklist items as typed content blocks. | yes |
| Plain text list conventions | Treat `- item` or `[ ] item` text as list content inside a textarea. | no |
| Full nested list editor | Support nested lists and advanced list manipulation now. | no |

**User's choice:** Auto-selected first-class checklist blocks as the recommended default.
**Notes:** Checklist blocks already exist in `notesContent.ts`; Phase 25 should expose authoring affordances without broad editor-engine scope.

---

## Notes Resume State

| Option | Description | Selected |
|--------|-------------|----------|
| App-session snapshot | Persist disposable selected folder, selected note, search/editor context, and selected block via `openos.apps.notes.session`. | yes |
| Durable note fields | Store UI context inside durable note records. | no |
| In-memory only | Reset Notes UI every time the app remounts or reloads. | no |

**User's choice:** Auto-selected app-session snapshot as the recommended default.
**Notes:** This directly uses the Phase 23 session contract and keeps durable user-authored data separate from disposable UI state.

---

## Architecture And Verification

| Option | Description | Selected |
|--------|-------------|----------|
| Pure helpers plus thin app shell | Put typed block editing/session parsing helpers in model/storage-adjacent modules and keep React focused on rendering/events. | yes |
| Component-only editing logic | Mutate block arrays directly inside `NotesApp.tsx` handlers. | no |
| New global state manager | Introduce a shared state dependency for Notes resume. | no |

**User's choice:** Auto-selected pure helpers plus thin app shell as the recommended default.
**Notes:** This follows Bright Builds functional-core guidance and the Phase 23/24 no-global-state decisions.

---

## the agent's Discretion

- Exact compact control layout, labels, and visual treatment.
- Exact Notes session payload type names and version number.
- Whether to split `NotesApp.tsx` as part of the implementation, provided behavior remains focused and verified.

## Deferred Ideas

- Notes sync/accounts, attachments, collaboration, locked notes, rich-text framework adoption, nested lists, block drag-reordering, markdown import/export.
- Browser tabs/session restore and broader cross-app resume polish.
