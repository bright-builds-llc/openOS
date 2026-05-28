---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 24-2026-05-28T03-12-00
generated_at: 2026-05-28T03:13:15.440Z
---

# Phase 24: Notes Structured Model And Migration - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Phase 24 moves durable Notes data from the current plain body-centered shape to a structured local content model while preserving the existing Notes user flow: folders, titles, timestamps, search, previews, local-only messaging, and browser-verified persistence. It should make structured content searchable and previewable now, but it must not add rich editor controls, checklist authoring UI, note resume/session behavior, sync/accounts, attachments, or a new global state manager. Those surfaces belong to later Notes and state phases.

</domain>

<decisions>
## Implementation Decisions

### Structured Notes Model

- **D-01:** The durable Notes snapshot should advance to a v3 structured model, not a parallel sidecar. The canonical note content should be a versioned local document with typed blocks.
- **D-02:** The first structured block set should support at least paragraph text, heading text, and checklist item text so search and previews can cover formatted/checklist-shaped content before Phase 25 adds editing UI.
- **D-03:** Preserve a plain-text adapter surface for the existing Notes app in Phase 24. The current title input and body textarea should keep working, with textarea edits converted into a structured paragraph document.
- **D-04:** Do not use a rich-text editor framework or third-party content package in this phase. The model should be plain TypeScript data with pure helpers.

### Migration And Durability

- **D-05:** Existing v1.2/v2 notes with `body`, `folderId`, `createdAt`, and `updatedAt` must migrate into structured content without losing title, body text, folder assignment, or timestamps.
- **D-06:** Legacy flat note arrays remain supported as an older import/migration path and should normalize into the same v3 shape.
- **D-07:** Folder normalization remains unchanged: default folder is preserved, duplicate folders/notes are de-duped, and notes whose folder no longer exists fall back to the default folder.
- **D-08:** Invalid stored Notes payloads can still fall back to an empty safe snapshot, matching current behavior. Do not make malformed durable Notes data delete unrelated session state or catalog data.

### Search And Preview

- **D-09:** Search should index title plus all structured content text. All query terms must continue to match case-insensitively across title and content.
- **D-10:** Note previews should be generated from meaningful structured content text, including checklist item labels, with the existing empty-note fallback preserved.
- **D-11:** Existing search/folder browsing behavior should remain visually and behaviorally compatible with the current Notes app and e2e coverage.

### Architecture And Verification

- **D-12:** Keep the pure content/model helpers separate from storage side effects. Parse and normalize raw durable payloads at the storage boundary, then use typed Notes data internally.
- **D-13:** Build on the Phase 23 app-session contract only as a guardrail; Phase 24 is durable data migration, not Notes resume/session implementation.
- **D-14:** Verification must include focused unit tests for v2-to-v3 migration, legacy-array migration, structured content search, structured previews, and existing Notes storage behavior. The canonical `verify:v1.3` command must remain green.

### the agent's Discretion

- The exact TypeScript module split is flexible, but prefer a small `notesContent` or equivalent pure module if the model helpers would make `notesModel.ts` too broad.
- The exact serialized v3 field names are flexible as long as they are explicit, versioned, and easy for Phase 25 to extend without another migration.
- The migration may write normalized v3 snapshots eagerly or lazily, provided tests prove the durable model read path returns structured notes and existing user-authored data remains intact.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone And Requirements

- `.planning/ROADMAP.md` — Phase 24 boundary, dependency on Phase 23, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` — `NOTES-01` and `NOTES-04` requirements mapped to Phase 24.
- `.planning/PROJECT.md` — project constraints, current milestone goal, and out-of-scope boundaries.
- `.planning/STATE.md` — current v1.3 progress and Phase 24 planning position.

### Prior State Contract

- `.planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md` — locked state/durable-data boundary decisions.
- `.planning/phases/23-state-contracts-and-verification-baseline/23-01-SUMMARY.md` — app-session helper and exact-key storage contract delivered by Phase 23.
- `.planning/phases/23-state-contracts-and-verification-baseline/23-02-SUMMARY.md` — Notes durable/session isolation and `verify:v1.3` baseline.

### Notes Code

- `src/features/apps/notes/notesModel.ts` — current Note/Folder types, filtering, sorting, titles, and previews.
- `src/features/apps/notes/notesStorage.ts` — current durable Notes snapshot parser, v2 storage shape, legacy flat-array migration, and storage API.
- `src/features/apps/notes/NotesApp.tsx` — current visible Notes app behavior, plain-text editor surface, search/folder UI, and local-only warning.
- `src/features/apps/notes/notesModel.test.ts` — current pure model tests for filtering, folder sorting, titles, and previews.
- `src/features/apps/notes/notesStorage.test.ts` — current storage, migration, folder, and Phase 23 durable/session isolation regressions.
- `tests/e2e/notes.spec.ts` — current browser-level Notes persistence, search, folders, and reload regression.

### Verification

- `scripts/verify-v1.3.sh` — canonical v1.3 verification command to keep green and extend only when needed.
- `package.json` — Bun script surface and existing verification commands.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `notesStorage.ts` already has a pure-ish parser/normalizer shape around a small `StorageLike` boundary, which is the right seam for v3 migration.
- `notesModel.ts` already owns pure note presentation helpers: filtering, preview text, title fallback, folder sorting, and updated-at sorting.
- `NotesApp.tsx` already keeps visible editing local to `title` and `body` inputs, so Phase 24 can preserve UI while adapting storage/model internals.
- Phase 23 `appSessionStorage.ts` proves exact-key session reset behavior and durable Notes isolation, but Phase 24 should not move durable Notes data into session storage.

### Established Patterns

- Notes is local-first and explicit about no sync/account recovery.
- Tests use Vitest with Arrange/Act/Assert comments for meaningful unit behavior.
- E2E coverage opens Notes through the launcher, creates folders and notes, searches, reloads, and verifies persistence.
- The repo uses Bun scripts, TypeScript, React 19, Vite, Vitest, and Playwright; no new runtime dependency is needed.

### Integration Points

- Structured content helpers should connect to `filterNotes`, `getNotePreview`, and the body editing path in `NotesApp.tsx`.
- Durable migration should connect to `notesStorage.ts` parse/read/write paths and preserve `createStoredNote`, `updateStoredNote`, `listStoredNotes`, and `listStoredFolders` callers.
- Focused tests should live beside the existing Notes model/storage tests, with the full `verify:v1.3` command used as the final gate.

</code_context>

<specifics>
## Specific Ideas

- Use a small, explicit block model rather than adopting an editor engine early.
- Let Phase 24 prove the information model and migration first; Phase 25 can add richer editing affordances on top.
- Keep existing user-facing Notes behavior stable while changing the durable data shape underneath.

</specifics>

<deferred>
## Deferred Ideas

- Rich editor controls, heading insertion, checklist/list authoring, and meaningful Notes resume state belong to Phase 25.
- Notes sync/accounts, attachments, collaboration, locked notes, and account recovery remain out of scope for v1.3.
- Browser tabs and session restore belong to Phase 26.
- Submitted-app registry generation belongs to Phase 27.
- Cross-app app-state polish belongs to Phase 28.

</deferred>

---

*Phase: 24-notes-structured-model-and-migration*
*Context gathered: 2026-05-28*
