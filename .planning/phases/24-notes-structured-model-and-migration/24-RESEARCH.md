# Phase 24: Notes Structured Model And Migration - Research

**Researched:** 2026-05-28  
**Domain:** Durable browser-local Notes data migration, TypeScript domain modeling, search/preview helpers  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

All bullets in this section are copied verbatim from `.planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md`. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

- Rich editor controls, heading insertion, checklist/list authoring, and meaningful Notes resume state belong to Phase 25.
- Notes sync/accounts, attachments, collaboration, locked notes, and account recovery remain out of scope for v1.3.
- Browser tabs and session restore belong to Phase 26.
- Submitted-app registry generation belongs to Phase 27.
- Cross-app app-state polish belongs to Phase 28.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NOTES-01 | User's existing v1.2 notes migrate to the v1.3 Notes model without losing title, body, folder, timestamps, or searchability. [VERIFIED: .planning/REQUIREMENTS.md] | Use a v3 parser/normalizer in `notesStorage.ts` that accepts v2 snapshots and legacy arrays, preserves `title`, `body` as structured paragraph text, `folderId`, `createdAt`, and `updatedAt`, then returns typed v3 notes to callers. [VERIFIED: src/features/apps/notes/notesStorage.ts] |
| NOTES-04 | User can search structured note content and see useful previews generated from formatted text. [VERIFIED: .planning/REQUIREMENTS.md] | Move search and preview text extraction behind pure content helpers used by `filterNotes` and `getNotePreview`, so title, paragraph, heading, and checklist item text all feed the same case-insensitive term matching and preview path. [VERIFIED: src/features/apps/notes/notesModel.ts] |
</phase_requirements>

## Summary

Phase 24 should keep the existing durable Notes key and replace the note content shape underneath it with a versioned v3 snapshot whose notes contain structured content blocks. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] The current storage boundary already reads `openos.apps.notes.notes` through `createAppStorageKey(namespace, "notes")`, parses raw JSON, normalizes folders and notes, and returns typed model data, making `notesStorage.ts` the correct migration site. [VERIFIED: src/features/apps/notes/notesStorage.ts] Web Storage values are string-based, so structured notes must continue to be JSON serialized at the boundary and parsed into domain types before app code uses them. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API]

The implementation should add a small pure `notesContent.ts` module or equivalent, then keep `notesModel.ts` focused on note/folder presentation helpers and `notesStorage.ts` focused on parse/normalize/read/write side effects. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] `NotesApp.tsx` is already 686 lines, above the Bright Builds file-size refactor trigger of roughly 628 lines, so the planner should avoid adding migration or content logic there. [VERIFIED: wc -l src/features/apps/notes/NotesApp.tsx; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md]

**Primary recommendation:** use plain TypeScript discriminated unions for note content, migrate v2 and legacy arrays at the Notes storage boundary, expose pure plain-text adapter helpers for the existing title/body UI, and add focused Vitest plus existing WebKit iPhone e2e coverage without adding runtime dependencies. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; VERIFIED: package.json]

## Project Constraints (from AGENTS.md)

- `AGENTS.md` is the repo-local entrypoint; `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant canonical standards pages must be loaded before planning or implementation. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md]
- The local overrides file has no concrete active exception beyond placeholder rows, so the canonical Bright Builds rules apply. [VERIFIED: standards-overrides.md]
- Use functional core / imperative shell: pure business logic belongs in data-in/data-out helpers, while storage, clocks, randomness, and framework effects stay in thin shells. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
- Parse raw input at boundaries and use domain types internally; this directly applies to `localStorage` JSON payloads read by `notesStorage.ts`. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md; VERIFIED: src/features/apps/notes/notesStorage.ts]
- Make illegal states unrepresentable when TypeScript can model them, so use discriminated block unions instead of loose optional fields for structured note content. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
- Prefer early returns, `maybe` naming for nullable internal values, and small named helpers; functions over roughly 161 lines and files over roughly 628 lines are refactor triggers. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md]
- Pure code and business logic need focused unit tests with clear Arrange, Act, Assert sections. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md]
- Use repo-owned verification entrypoints before commit; this repo already exposes `verify:v1.3` through `package.json` and `scripts/verify-v1.3.sh`. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/verification.md; VERIFIED: package.json; VERIFIED: scripts/verify-v1.3.sh]
- This is a Bun-friendly TypeScript repository; prefer Bun scripts and do not add Python scripts for this phase. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md; VERIFIED: package.json]
- Prefer composition, plain objects, and functions over project-defined class inheritance in TypeScript. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- No repo-local `.claude/skills/` or `.agents/skills/` directory is present, so there are no project-local skill rules to apply. [VERIFIED: ls .claude/skills; VERIFIED: ls .agents/skills]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | Project range `^6.0.2`, lock `6.0.2`, registry latest `6.0.3` | Typed Notes content model, storage parsers, and compile-time checks | Existing strict TS config covers `src` and Vite config, and Phase 24 needs stronger domain types rather than new runtime schema packages. [VERIFIED: package.json; VERIFIED: bun.lock; VERIFIED: tsconfig.json; VERIFIED: npm registry via `npm view typescript`] |
| React | Project range `^19.2.4`, lock `19.2.5`, registry latest `19.2.6` | Existing Notes app UI and controlled title/body inputs | Notes is already implemented as a React app; Phase 24 should preserve the visible app behavior while moving data helpers out of the component. [VERIFIED: package.json; VERIFIED: bun.lock; VERIFIED: src/features/apps/notes/NotesApp.tsx; VERIFIED: npm registry via `npm view react`] |
| React DOM | Project range `^19.2.4`, lock `19.2.5`, registry latest `19.2.6` | Existing React DOM runtime | Keep the current runtime; migration does not require DOM package changes. [VERIFIED: package.json; VERIFIED: bun.lock; VERIFIED: npm registry via `npm view react-dom`] |
| Vite | Project range `^8.0.3`, lock `8.0.8`, local binary `8.0.8`, registry latest `8.0.14` | Build and local preview for e2e verification | `package.json`, Vite config, and Playwright webServer already use Vite build/preview paths. [VERIFIED: package.json; VERIFIED: bun.lock; VERIFIED: vite.config.ts; VERIFIED: playwright.config.ts; VERIFIED: npm registry via `npm view vite`] |
| Vitest | Project range `^4.1.2`, lock `4.1.4`, local binary `4.1.4`, registry latest `4.1.7` | Focused unit tests for pure content/model/storage migration helpers | Existing Notes model/storage tests use Vitest and already cover filtering, previews, storage migration, and durable/session isolation. [VERIFIED: package.json; VERIFIED: bun.lock; VERIFIED: src/features/apps/notes/notesModel.test.ts; VERIFIED: src/features/apps/notes/notesStorage.test.ts; VERIFIED: npm registry via `npm view vitest`] |
| Playwright | Project range `^1.59.1`, lock `1.59.1`, local binary `1.59.1`, registry latest `1.60.0` | WebKit iPhone e2e persistence/search/folder verification | `tests/e2e/notes.spec.ts` and `verify:v1.3` already cover the launcher path and WebKit iPhone suite. [VERIFIED: package.json; VERIFIED: bun.lock; VERIFIED: tests/e2e/notes.spec.ts; VERIFIED: scripts/verify-v1.3.sh; VERIFIED: npm registry via `npm view @playwright/test`] |
| Bun | `1.3.9` in `packageManager` and local runtime `1.3.9` | Package manager and script runner | Repo scripts use Bun and Bright Builds TS/JS guidance prefers Bun for Bun-friendly TS repos. [VERIFIED: package.json; VERIFIED: `bun --version`; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md] |

### Supporting

| Library / Module | Version | Purpose | When to Use |
|------------------|---------|---------|-------------|
| `src/features/apps/notes/notesStorage.ts` | Existing app module | Owns durable Notes `StorageLike` reads/writes, raw JSON parsing, legacy array migration, v2 snapshot normalization, and CRUD APIs | Extend this boundary for v3 parsing and migration; do not move migration into React components. [VERIFIED: src/features/apps/notes/notesStorage.ts] |
| `src/features/apps/notes/notesModel.ts` | Existing app module | Owns Note/Folder types, sorting, title fallback, preview generation, and search filtering | Update pure model helpers to consume structured content text through `notesContent` helpers. [VERIFIED: src/features/apps/notes/notesModel.ts] |
| `src/features/platform/appStorage.ts` | Existing platform module | Builds stable app storage namespaces and exact keys | Keep durable Notes on `createAppStorageKey(namespace, "notes")`; do not introduce a sidecar key. [VERIFIED: src/features/platform/appStorage.ts; VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| `src/features/platform/appSessionStorage.ts` | Existing platform module | Provides exact-key disposable `.session` state helpers | Use only as a guardrail; Phase 24 must not move durable Notes data into session storage. [VERIFIED: src/features/platform/appSessionStorage.ts; VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| Web Storage API | Browser API | Stores origin-scoped string key/value data | Continue using `localStorage` through `StorageLike`; JSON stringify structured snapshots and parse at the boundary. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API; VERIFIED: src/features/apps/notes/NotesApp.tsx] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain TypeScript content blocks | Rich-text editor framework or document schema package | Explicitly out of scope and would add dependency/editor complexity before Phase 25 UI work. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| Existing `filterNotes` with structured text extraction | Full-text index package | Current requirement is title/content term matching, not ranking, stemming, or large-corpus indexing. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/features/apps/notes/notesModel.ts] |
| Notes storage boundary parser | Component-owned migration in `NotesApp.tsx` | Component-owned migration would put durable data parsing in a 686-line UI shell instead of the existing storage boundary. [VERIFIED: src/features/apps/notes/NotesApp.tsx; VERIFIED: src/features/apps/notes/notesStorage.ts] |
| Existing app-owned storage modules | Global state manager | A new global state dependency is out of scope for v1.3 and not needed for durable local Notes migration. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |

**Installation:**

```bash
# No new packages are recommended for Phase 24. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]
bun install
```

**Version verification:** Current registry checks were run with `npm view [package] version time.modified --json`. [VERIFIED: npm registry via `npm view`]

| Package | Registry Latest | Registry Modified | Project Lock | Planning Impact |
|---------|-----------------|-------------------|--------------|-----------------|
| `react` | `19.2.6` | `2026-05-27T17:19:56.897Z` | `19.2.5` | Do not upgrade for this phase; no React feature is needed. [VERIFIED: npm registry; VERIFIED: bun.lock] |
| `react-dom` | `19.2.6` | `2026-05-27T17:20:08.914Z` | `19.2.5` | Do not upgrade for this phase; no DOM runtime change is needed. [VERIFIED: npm registry; VERIFIED: bun.lock] |
| `@vitejs/plugin-react` | `6.0.2` | `2026-05-14T20:03:24.389Z` | `6.0.1` | Do not upgrade for this phase; Vite build already works through existing config. [VERIFIED: npm registry; VERIFIED: bun.lock; VERIFIED: vite.config.ts] |
| `vite` | `8.0.14` | `2026-05-21T07:16:03.512Z` | `8.0.8` | Do not upgrade for this phase; use existing build/preview path. [VERIFIED: npm registry; VERIFIED: bun.lock; VERIFIED: playwright.config.ts] |
| `typescript` | `6.0.3` | `2026-04-16T23:38:28.092Z` | `6.0.2` | Do not upgrade for this phase; strict TS already validates source. [VERIFIED: npm registry; VERIFIED: bun.lock; VERIFIED: tsconfig.json] |
| `vitest` | `4.1.7` | `2026-05-20T07:19:42.501Z` | `4.1.4` | Do not upgrade for this phase; add tests to existing files or adjacent files. [VERIFIED: npm registry; VERIFIED: bun.lock] |
| `@playwright/test` | `1.60.0` | `2026-05-27T15:23:11.153Z` | `1.59.1` | Do not upgrade for this phase; existing WebKit iPhone project is sufficient. [VERIFIED: npm registry; VERIFIED: bun.lock; VERIFIED: playwright.config.ts] |

## Architecture Patterns

### Recommended Project Structure

```text
src/features/apps/notes/
├── notesContent.ts        # Pure structured content block model and text adapters. [RECOMMENDED]
├── notesModel.ts          # Note/Folder domain types, sorting, filtering, previews. [VERIFIED: src/features/apps/notes/notesModel.ts]
├── notesStorage.ts        # Durable Notes parser, v2/legacy migration, v3 write path. [VERIFIED: src/features/apps/notes/notesStorage.ts]
├── NotesApp.tsx           # React shell; keep title/body textarea adapter calls only. [VERIFIED: src/features/apps/notes/NotesApp.tsx]
└── *.test.ts              # Focused Vitest coverage for pure helpers and storage boundaries. [VERIFIED: src/features/apps/notes/notesModel.test.ts; VERIFIED: src/features/apps/notes/notesStorage.test.ts]
```

### Pattern 1: Versioned Content Blocks

**What:** Represent note content as a small discriminated union and a versioned document object, not as loose optional fields. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]

**When to use:** Use this for all in-memory v3 notes returned by the storage boundary. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]

**Example:**

```typescript
// Source: Phase 24 decisions + Bright Builds type-driven architecture.
// [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]
// [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
export type NoteContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "checklistItem"; text: string; checked: boolean };

export type NoteContentDocument = {
  version: 1;
  blocks: NoteContentBlock[];
};

export type Note = {
  id: string;
  title: string;
  content: NoteContentDocument;
  folderId: string;
  createdAt: string;
  updatedAt: string;
};
```

### Pattern 2: Plain-Text Adapter for Existing UI

**What:** Keep the UI textarea path plain, but convert textarea strings into structured content with a pure helper and derive textarea/search/preview text from structured content with pure helpers. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; VERIFIED: src/features/apps/notes/NotesApp.tsx]

**When to use:** Use this in `createStoredNote`, `updateStoredNote`, `NotesApp` textarea value, `filterNotes`, and `getNotePreview`. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/apps/notes/notesModel.ts; VERIFIED: src/features/apps/notes/NotesApp.tsx]

**Example:**

```typescript
// Source: Existing textarea UI plus Phase 24 structured-content decision.
// [VERIFIED: src/features/apps/notes/NotesApp.tsx]
// [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]
export function createNoteContentFromPlainText(
  body: string,
): NoteContentDocument {
  if (body === "") {
    return { version: 1, blocks: [] };
  }

  return {
    version: 1,
    blocks: [{ kind: "paragraph", text: body }],
  };
}

export function getNoteContentText(
  content: NoteContentDocument,
): string {
  return content.blocks
    .map((block) => block.text)
    .join("\n");
}
```

### Pattern 3: Parse Raw Storage Once, Then Normalize

**What:** Treat `localStorage` data as untrusted strings, parse unknown payloads into versioned snapshot variants, normalize to the v3 internal snapshot, and keep invalid payload fallback behavior. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API; VERIFIED: src/features/apps/notes/notesStorage.ts]

**When to use:** Use this in the private `parseSnapshot` path; public callers should receive typed notes/folders and should not re-validate raw durable payloads. [VERIFIED: src/features/apps/notes/notesStorage.ts; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]

**Example:**

```typescript
// Source: Existing notesStorage parser/normalizer pattern.
// [VERIFIED: src/features/apps/notes/notesStorage.ts]
type StoredNotesSnapshot =
  | { version: 3; folders: NoteFolder[]; notes: StoredNoteV3[] }
  | { version: 2; folders: NoteFolder[]; notes: StoredNoteV2[] }
  | StoredNoteV2[];

function parseSnapshot(maybeValue: string | null): NotesSnapshot {
  if (maybeValue === null) {
    return createEmptySnapshot();
  }

  try {
    const maybeParsed = JSON.parse(maybeValue);
    return normalizeStoredNotesSnapshot(maybeParsed);
  } catch {
    return createEmptySnapshot();
  }
}
```

### Pattern 4: Preserve Existing Folder Normalization

**What:** Keep default-folder insertion, duplicate folder/note de-dupe, updated-at sorting, and fallback of missing `folderId` to `DEFAULT_NOTES_FOLDER_ID`. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/apps/notes/notesStorage.test.ts]

**When to use:** Reuse the existing normalization logic while changing the note content field; do not rewrite folder semantics in the same phase. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]

**Example:**

```typescript
// Source: Existing normalizeSnapshot behavior.
// [VERIFIED: src/features/apps/notes/notesStorage.ts]
const normalizedNotes = maybeSnapshot.notes.flatMap((note) => {
  if (noteIds.has(note.id)) {
    return [];
  }

  noteIds.add(note.id);
  return [
    {
      ...note,
      folderId: folderIds.has(note.folderId)
        ? note.folderId
        : DEFAULT_NOTES_FOLDER_ID,
    },
  ];
});
```

### Anti-Patterns to Avoid

- **Dual canonical body/content storage:** Do not store both durable `body` and durable `content` in v3 notes because they can drift; keep `body` as an adapter input/output only. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
- **Component-owned migration:** Do not parse or rewrite durable note snapshots inside `NotesApp.tsx`; the current storage module already owns that boundary and the component is already over the file-size refactor trigger. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: wc -l src/features/apps/notes/NotesApp.tsx; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md]
- **Sidecar v3 key:** Do not create a second content key because Phase 24 explicitly chooses canonical v3 on the durable Notes snapshot. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]
- **Session-state migration:** Do not use `openos.apps.notes.session` for durable note content; Phase 23 established that `.session` is disposable app UI context. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md; VERIFIED: src/features/platform/appSessionStorage.ts]
- **Storage-wide clearing:** Do not call `localStorage.clear()` or remove unrelated app keys during malformed Notes fallback; current behavior returns an empty Notes snapshot only for malformed Notes payloads. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/platform/appSessionStorage.test.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text editing | Selection/range editor, toolbar, markdown parser, heading/checklist authoring UI | Plain textarea adapter plus structured data helpers | Phase 24 is model/migration/search/preview only; editor controls are deferred to Phase 25. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| Full-text search infrastructure | Custom index, ranking, stemming, worker-backed search | Existing `filterNotes` term matching fed by `getNoteContentText` | Requirement needs case-insensitive all-term matching over title/content, which current helper shape already implements for title/body. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/features/apps/notes/notesModel.ts] |
| Global migration framework | Cross-app migration registry or state manager | Notes-owned `notesStorage.ts` parser/normalizer | Phase 24 only migrates Notes durable data and v1.3 excludes a new global state manager. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| Runtime schema dependency | New Zod/Joi-style package | Small TypeScript parser helpers at the storage boundary | Phase 24 forbids third-party content packages and the repo already parses storage payloads with local helpers. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; VERIFIED: src/features/apps/notes/notesStorage.ts] |
| Storage availability framework | New persistence abstraction for this phase | Existing `StorageLike` adapter and Phase 23 app-session helper as a guardrail | Notes storage already accepts a small `StorageLike`; Phase 24 is durable migration, not new storage UX. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-02-SUMMARY.md] |

**Key insight:** the hard part is not rendering structured notes; it is making v2, legacy arrays, invalid payloads, folders, search, previews, and the existing body textarea all converge on one v3 content model without duplicating canonical state. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/apps/notes/notesModel.ts]

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Browser `localStorage` durable Notes key is `openos.apps.notes.notes`, built from namespace `openos.apps.notes` plus key `notes`; current payload can be a v2 snapshot or a legacy flat note array. [VERIFIED: src/features/platform/appStorage.ts; VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/apps/notes/notesStorage.test.ts] | Code edit plus data migration path: parse v2 and arrays into v3 structured notes on read, write v3 snapshots on create/update/delete, and preserve exact folder/timestamp fields. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| Live service config | None found for Notes migration; repo search found browser `localStorage` usage and app metadata, not external service configuration holding the Notes model. [VERIFIED: `rg -n "pm2|launchd|systemd|plist|Task Scheduler|cron|Docker|docker|redis|postgres|indexedDB|openos\\.apps\\.notes|localStorage" . src tests scripts package.json`] | No live service patch required. [VERIFIED: same grep audit] |
| OS-registered state | None found; repo search found no pm2, launchd, systemd, plist, Task Scheduler, Docker, Redis, Postgres, or indexedDB state for Notes. [VERIFIED: `rg -n "pm2|launchd|systemd|plist|Task Scheduler|cron|Docker|docker|redis|postgres|indexedDB|openos\\.apps\\.notes|localStorage" . src tests scripts package.json`] | No OS re-registration required. [VERIFIED: same grep audit] |
| Secrets/env vars | No Notes-related secrets or env vars found; grep found generic README media env vars and constants such as `NOTES_STORAGE_VERSION`, not secret-backed Notes model configuration. [VERIFIED: `rg -n "NOTES_|OPENOS|VITE_|process\\.env|secret|token|SOPS|openos\\.apps\\.notes" . src tests scripts package.json -g '!node_modules'`] | No secret or env var migration required. [VERIFIED: same grep audit] |
| Build artifacts | No repo-tracked build artifact stores the old Notes model; relevant build/test files are `bun.lock`, Vite config, Playwright config, and source/tests. [VERIFIED: `rg --files -g 'bun.lock*' -g 'package-lock.json' -g 'yarn.lock' -g 'pnpm-lock.yaml' -g 'tsconfig*.json' -g 'vite.config.*' -g 'vitest.config.*' -g 'playwright.config.*'`] | No artifact migration required; rerun tests/build through `verify:v1.3`. [VERIFIED: package.json; VERIFIED: scripts/verify-v1.3.sh] |

**Nothing found in category:** Live service config, OS-registered state, secrets/env vars, and build artifacts had no Notes model runtime state beyond source-controlled code/config and browser `localStorage`. [VERIFIED: grep audits listed above]

## Common Pitfalls

### Pitfall 1: Rejecting v2 Data When Bumping the Version

**What goes wrong:** `parseSnapshot` currently accepts only `version: 2` object snapshots or legacy arrays; changing the constant to `3` without a v2 branch would make existing v2 notes fall back to an empty safe snapshot. [VERIFIED: src/features/apps/notes/notesStorage.ts]  
**Why it happens:** The current parser checks `maybeParsed.version !== NOTES_STORAGE_VERSION` and treats mismatches as invalid. [VERIFIED: src/features/apps/notes/notesStorage.ts]  
**How to avoid:** Parse v3, v2, and legacy arrays as distinct variants, then normalize all valid variants into one v3 internal snapshot. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]  
**Warning signs:** A v2 fixture with `folders`, `notes`, `body`, and timestamps returns zero notes after Phase 24. [VERIFIED: src/features/apps/notes/notesStorage.test.ts]

### Pitfall 2: Losing Folder Browsing During Migration

**What goes wrong:** Notes can disappear from a selected folder if migration drops `folderId`, fails to preserve folders, or mishandles missing-folder fallback. [VERIFIED: .planning/ROADMAP.md; VERIFIED: src/features/apps/notes/notesStorage.ts]  
**Why it happens:** Folder counts, selected folder browsing, and editor folder select all depend on `note.folderId` matching normalized folder ids. [VERIFIED: src/features/apps/notes/NotesApp.tsx]  
**How to avoid:** Keep existing `normalizeSnapshot` semantics for default folder insertion, de-dupe, and fallback to `DEFAULT_NOTES_FOLDER_ID`. [VERIFIED: src/features/apps/notes/notesStorage.ts]  
**Warning signs:** `notes-folder-filter:recipes` becomes visible but its migrated notes do not appear after reload. [VERIFIED: tests/e2e/notes.spec.ts]

### Pitfall 3: Search Only Uses Legacy `body`

**What goes wrong:** Heading/checklist v3 notes become previewable in storage but not searchable if `filterNotes` still builds the haystack from `note.title` plus `note.body`. [VERIFIED: src/features/apps/notes/notesModel.ts; VERIFIED: .planning/REQUIREMENTS.md]  
**Why it happens:** Current search assumes a flat `body` string and has no structured text extractor. [VERIFIED: src/features/apps/notes/notesModel.ts]  
**How to avoid:** Add `getNoteContentText` and call it from `filterNotes` and `getNotePreview`. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]  
**Warning signs:** A v3 checklist label appears in a fixture but a query for the label returns no result. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]

### Pitfall 4: Duplicating Canonical Content

**What goes wrong:** Keeping both durable `body` and durable `content` in v3 can let edits update one field while search/preview reads the other. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]  
**Why it happens:** The current UI and tests are body-centered, so a superficial migration may add `content` without removing body as canonical state. [VERIFIED: src/features/apps/notes/NotesApp.tsx; VERIFIED: src/features/apps/notes/notesModel.test.ts]  
**How to avoid:** Make structured content the only durable canonical note text and keep plain `body` as an adapter input or derived helper result. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]  
**Warning signs:** A test can construct a note with `body: "A"` and `content` text `"B"` and app behavior depends on which helper reads it. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]

### Pitfall 5: Adding More Logic to an Already Oversized UI File

**What goes wrong:** Migration, content parsing, and preview/search rules end up inside `NotesApp.tsx`, making the UI harder to test and increasing regression risk. [VERIFIED: src/features/apps/notes/NotesApp.tsx]  
**Why it happens:** The visible body textarea path is in the component, so it is tempting to adapt raw storage there. [VERIFIED: src/features/apps/notes/NotesApp.tsx]  
**How to avoid:** Put content and storage migration logic in pure modules and storage helpers; let the component call adapter helpers only. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]  
**Warning signs:** `NotesApp.tsx` gains raw `JSON.parse`, snapshot version checks, or block extraction loops. [VERIFIED: src/features/apps/notes/NotesApp.tsx]

## Code Examples

Verified patterns from local code and official sources:

### Storage Boundary Parser Shape

```typescript
// Source: Existing notesStorage parser/normalizer.
// [VERIFIED: src/features/apps/notes/notesStorage.ts]
function parseNote(maybeValue: unknown): Note | null {
  if (
    !isRecord(maybeValue) ||
    typeof maybeValue.id !== "string" ||
    typeof maybeValue.title !== "string" ||
    typeof maybeValue.body !== "string" ||
    typeof maybeValue.createdAt !== "string" ||
    typeof maybeValue.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: maybeValue.id,
    title: maybeValue.title,
    body: maybeValue.body,
    folderId:
      typeof maybeValue.folderId === "string"
        ? maybeValue.folderId
        : DEFAULT_NOTES_FOLDER_ID,
    createdAt: maybeValue.createdAt,
    updatedAt: maybeValue.updatedAt,
  };
}
```

### Current Search Term Semantics to Preserve

```typescript
// Source: Existing notesModel all-term case-insensitive search.
// [VERIFIED: src/features/apps/notes/notesModel.ts]
const queryTerms = options.query
  .trim()
  .toLowerCase()
  .split(/\s+/)
  .filter(Boolean);

return queryTerms.every((term) =>
  haystack.includes(term),
);
```

### Structured Search Replacement Shape

```typescript
// Source: Phase 24 search requirement plus existing filterNotes semantics.
// [VERIFIED: .planning/REQUIREMENTS.md]
// [VERIFIED: src/features/apps/notes/notesModel.ts]
const haystack = `${note.title}\n${getNoteContentText(
  note.content,
)}`.toLowerCase();
```

### Plain Text Preview Adapter

```typescript
// Source: Existing preview whitespace collapse and Phase 24 structured preview requirement.
// [VERIFIED: src/features/apps/notes/notesModel.ts]
// [VERIFIED: .planning/REQUIREMENTS.md]
export function getNotePreview(note: Note): string {
  const collapsedContent = getNoteContentText(note.content)
    .replace(/\s+/g, " ")
    .trim();

  if (collapsedContent === "") {
    return "Empty note";
  }

  return collapsedContent.slice(0, NOTE_PREVIEW_LENGTH);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Durable note text is a flat `body` string in v2 notes. [VERIFIED: src/features/apps/notes/notesModel.ts; VERIFIED: src/features/apps/notes/notesStorage.ts] | Durable note text becomes versioned structured content blocks in v3. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] | Phase 24 planning, 2026-05-28. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] | Search, preview, and future editor UI can target paragraph, heading, and checklist text without another data-shape rewrite. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| Legacy flat arrays migrate into v2 default-folder snapshots. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/apps/notes/notesStorage.test.ts] | Legacy arrays and v2 snapshots normalize into the same v3 shape. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] | Phase 24. [VERIFIED: .planning/ROADMAP.md] | Existing v1.2 local data remains readable and searchable after the model change. [VERIFIED: .planning/REQUIREMENTS.md] |
| App-session and durable data boundaries were implicit before Phase 23. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md] | Durable Notes remain on `openos.apps.notes.notes`, while disposable UI session state uses `openos.apps.notes.session`. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-01-SUMMARY.md; VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-02-SUMMARY.md] | Phase 23, 2026-05-27. [VERIFIED: .planning/STATE.md] | Phase 24 migration must not delete or move durable data through session reset helpers. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| Reads and writes use JSON strings in Web Storage. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API] | Continue using JSON strings, but parse to stricter domain types before internal use. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md] | Existing browser storage API; Phase 24 applies stricter parsing. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API] | Prevents raw storage shape assumptions from leaking into UI/model helpers. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md] |

**Deprecated/outdated:**

- Durable `body` as the only canonical note text is outdated for Phase 24 because the phase requires structured paragraph, heading, and checklist text to be searchable and previewable. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; VERIFIED: .planning/REQUIREMENTS.md]
- Component-owned migration is outdated for this phase because the locked architecture decision places parsing and normalization at the storage boundary. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]
- Adding a rich editor or third-party content package is out of scope for this phase. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|

**All claims in this research were verified or cited; no `[ASSUMED]` claims are present.** [VERIFIED: research provenance review]

## Open Questions (RESOLVED)

1. **RESOLVED: Should the implementation eagerly rewrite v2 snapshots to v3 on read, or lazily persist v3 on the next mutation?** [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]
   - What we know: The user explicitly allows either eager or lazy migration if tests prove the read path returns structured notes and data remains intact. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md]
   - Decision: Use lazy persistence. Version-2 snapshots and legacy arrays must read as structured v3 `Note` objects immediately, but durable `localStorage` only needs to be rewritten as `version: 3` on the next create/update/delete/write path. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-02-PLAN.md]
   - Rationale: Lazy persistence avoids read-side effects while still proving the user-visible migration: existing notes reopen with title, body text, folder, timestamps, searchability, and previews intact. [VERIFIED: .planning/ROADMAP.md; VERIFIED: .planning/REQUIREMENTS.md]
   - Planning implication: Plan 24-02 should keep its current version-3 write-path assertions and should not add a requirement that merely opening Notes rewrites `localStorage` to `version: 3`. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-02-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Scripts, tests, build, verification | yes | `1.3.9` | None needed. [VERIFIED: `bun --version`; VERIFIED: package.json] |
| Node.js | Vite/Vitest/Playwright toolchain | yes | `v24.13.0` | None needed. [VERIFIED: `node --version`] |
| npm registry access | Package version verification | yes | npm CLI `11.6.2` | If unavailable during execution, use existing `bun.lock`. [VERIFIED: `npm --version`; VERIFIED: npm registry via `npm view`] |
| TypeScript CLI | Typecheck and build | yes | `6.0.2` local binary | Use `bun x tsc --noEmit` through existing scripts. [VERIFIED: `node_modules/.bin/tsc --version`; VERIFIED: scripts/verify-v1.3.sh] |
| Vitest CLI | Focused unit tests | yes | `4.1.4` local binary | None needed. [VERIFIED: `node_modules/.bin/vitest --version`] |
| Vite CLI | Production build and preview | yes | `8.0.8` local binary | None needed. [VERIFIED: `node_modules/.bin/vite --version`; VERIFIED: playwright.config.ts] |
| Playwright CLI | WebKit iPhone e2e | yes | `1.59.1` local binary | If browsers are missing at execution time, run the repo's Playwright install path before e2e. [VERIFIED: `node_modules/.bin/playwright --version`; VERIFIED: playwright.config.ts] |

**Missing dependencies with no fallback:** None found during research. [VERIFIED: environment probes above]

**Missing dependencies with fallback:** None required for planning; npm registry access has the fallback of using the existing lockfile for implementation. [VERIFIED: bun.lock]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement` to `false`. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

OWASP states ASVS 5.0.0 is the latest stable version and recommends versioned requirement identifiers because identifiers can change between versions. [CITED: https://owasp.org/www-project-application-security-verification-standard/] The table below uses the GSD template category names as a planning taxonomy, with the v5 relevance noted where applicable. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No authentication, accounts, or identity state is in Phase 24 scope. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| V3 Session Management | no for implementation; yes as boundary guardrail | Do not store durable Notes data in `.session`; Phase 23 session helpers remain disposable UI-context tooling only. [VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-01-SUMMARY.md; VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md] |
| V4 Access Control | no | No multi-user authorization or privileged operation is introduced. [VERIFIED: .planning/REQUIREMENTS.md] |
| V5 Input Validation | yes | Parse `localStorage` JSON into typed v3 domain data at the storage boundary and reject malformed/invalid payloads safely. [VERIFIED: src/features/apps/notes/notesStorage.ts; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md] |
| V6 Cryptography | no | No encryption, hashing, key management, or secret handling is introduced. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: secrets/env grep audit] |

### Known Threat Patterns for Notes Local Storage

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed or tampered Notes JSON causes data loss | Tampering | Parse exact v3/v2/legacy shapes, return an empty safe snapshot only for invalid Notes payloads, and never clear unrelated keys. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/platform/appSessionStorage.test.ts] |
| Prototype/property pollution through direct Web Storage property access | Tampering | Use `getItem`, `setItem`, and `removeItem` APIs rather than direct object property access. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API; VERIFIED: src/features/apps/notes/notesStorage.ts] |
| Treating untrusted stored text as markup | Injection | Keep note content as text data and do not introduce HTML rendering for structured content in Phase 24. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; VERIFIED: src/features/apps/notes/NotesApp.tsx] |
| Durable/session key confusion | Tampering | Keep exact durable key `openos.apps.notes.notes` separate from exact session key `openos.apps.notes.session`. [VERIFIED: src/features/platform/appStorage.ts; VERIFIED: src/features/platform/appSessionStorage.ts; VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-02-SUMMARY.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md` - locked Phase 24 decisions, boundaries, verification requirements. [VERIFIED: local file]
- `.planning/REQUIREMENTS.md` - `NOTES-01` and `NOTES-04` requirement definitions and traceability. [VERIFIED: local file]
- `.planning/ROADMAP.md` - Phase 24 goal, success criteria, and dependency on Phase 23. [VERIFIED: local file]
- `.planning/STATE.md` - current phase position and Phase 23 completion state. [VERIFIED: local file]
- `.planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md` - durable/session boundary decisions. [VERIFIED: local file]
- `.planning/phases/23-state-contracts-and-verification-baseline/23-01-SUMMARY.md` - app-session helper delivered. [VERIFIED: local file]
- `.planning/phases/23-state-contracts-and-verification-baseline/23-02-SUMMARY.md` - Notes durable/session isolation and `verify:v1.3` wiring. [VERIFIED: local file]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo workflow, standards precedence, and no active local exception. [VERIFIED: local files]
- `src/features/apps/notes/notesModel.ts`, `notesStorage.ts`, `NotesApp.tsx`, `notesModel.test.ts`, `notesStorage.test.ts`, `tests/e2e/notes.spec.ts` - current Notes behavior and tests. [VERIFIED: local files]
- `scripts/verify-v1.3.sh`, `package.json`, `bun.lock`, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts` - verification and toolchain. [VERIFIED: local files]
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: architecture, code-shape, verification, testing, TypeScript/JavaScript. [CITED: https://github.com/bright-builds-llc/bright-builds-rules/tree/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards]
- npm registry via `npm view` - current registry versions and modified timestamps for React, React DOM, Vite, TypeScript, Vitest, Playwright, and plugin-react. [VERIFIED: npm registry]
- MDN Web Storage API - string key/value storage, JSON serialization, localStorage persistence, and Web Storage API method guidance. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API]
- OWASP ASVS project page - latest stable ASVS 5.0.0 and versioned identifier guidance. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Secondary (MEDIUM confidence)

- None used. [VERIFIED: source review]

### Tertiary (LOW confidence)

- None used. [VERIFIED: source review]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - package versions were verified against `package.json`, `bun.lock`, local binaries, and npm registry; no new packages are recommended. [VERIFIED: package.json; VERIFIED: bun.lock; VERIFIED: npm registry]
- Architecture: HIGH - Phase 24 decisions, existing Notes storage/model boundaries, and Bright Builds standards all point to the same pure-helper plus storage-boundary design. [VERIFIED: .planning/phases/24-notes-structured-model-and-migration/24-CONTEXT.md; VERIFIED: src/features/apps/notes/notesStorage.ts; CITED: Bright Builds architecture standard]
- Pitfalls: HIGH - pitfalls come from current parser/version checks, current body-centered search, current folder normalization, and Phase 23 durable/session boundaries. [VERIFIED: src/features/apps/notes/notesStorage.ts; VERIFIED: src/features/apps/notes/notesModel.ts; VERIFIED: .planning/phases/23-state-contracts-and-verification-baseline/23-02-SUMMARY.md]

**Research date:** 2026-05-28  
**Valid until:** 2026-06-27 for local architecture decisions; package latest versions should be rechecked within 7 days if dependency upgrades enter scope. [VERIFIED: npm registry modified dates]
