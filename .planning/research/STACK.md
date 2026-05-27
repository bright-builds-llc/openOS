# Technology Stack Research: v1.3 Stateful Apps & Platform Maturity

**Project:** openOS
**Researched:** 2026-05-27
**Scope:** Richer local Notes editing/structure, Browser tabs/session state, submitted-app workflow maturity, and core app-state polish
**Overall confidence:** HIGH

## Recommendation

Do not add new runtime libraries for v1.3. The existing React 19, Vite 8, TypeScript 6, Bun, Vitest, and Playwright stack is enough for the target features. v1.3 should add internal domain modules, versioned storage snapshots, and one Bun-owned metadata workflow script/generator rather than adopting a rich-text editor, global state manager, schema validator, IndexedDB wrapper, or router.

The v1.3 work is mostly product-state modeling, not framework capability. Existing code already has app storage namespaces, pure model modules, local storage adapters, Bun validation scripts, Vitest unit tests, and WebKit iPhone Playwright coverage. The right stack change is to mature those seams.

## Current Stack And Version Check

| Area | Current in repo | Latest observed 2026-05-27 | Recommendation |
|------|-----------------|-----------------------------|----------------|
| Package manager/script runtime | `bun@1.3.9` | Local `bun --version` is `1.3.9` | Keep. |
| React | `react` package range `^19.2.4`, lock `19.2.5` | `19.2.6` | Optional patch refresh, not a v1.3 prerequisite. |
| React DOM | range `^19.2.4`, lock `19.2.5` | `19.2.6` | Optional patch refresh with React. |
| React types | range `^19.2.4`, lock `19.2.14` | `19.2.15` | Optional patch refresh. |
| React DOM types | range/lock `19.2.3` | `19.2.3` | Current. |
| Vite | range `^8.0.3`, lock `8.0.8` | `8.0.14` | Optional patch refresh. |
| Vite React plugin | range/lock `6.0.1` | `6.0.2` | Optional patch refresh. |
| TypeScript | range/lock `6.0.2` | `6.0.3` | Optional patch refresh. |
| Vitest | range `^4.1.2`, lock `4.1.4` | `4.1.7` | Optional patch refresh. |
| Playwright | range/lock `1.59.1` | `1.60.0` | Optional patch refresh in a verification-focused phase because browser snapshots can shift. |

Version source: `package.json`, `bun.lock`, `bun --version`, and `bun pm view <package> version` on 2026-05-27.

## Recommended Stack Additions

### Notes: Internal Structured Document Model

| Addition | Type | Why |
|----------|------|-----|
| `notesDocumentModel.ts` | Internal TypeScript module | Add a typed note content model without committing to a third-party editor. Use a discriminated union such as paragraph, heading, bullet, checklist item, and divider if needed. |
| Notes storage version `3` | Internal storage migration | Migrate current v2 `{ title, body, folderId }` notes into a structured content snapshot while preserving existing notes, search, previews, and folders. |
| Pure editing transforms | Internal TypeScript helpers | Implement insert block, update block text, toggle checklist, move block, delete block, and derive plain text for search/preview as data-in/data-out functions. |

Use controlled React inputs/textareas per block or simple command buttons over plain data. Avoid storing HTML. This keeps search, preview, validation, migration, and tests straightforward and avoids a sanitizer dependency.

Do not add Lexical, TipTap, ProseMirror, Slate, or a similar editor framework in v1.3. Those libraries become justified only if the product explicitly needs inline selection formatting, robust undo history, paste-from-rich-sources normalization, collaborative editing, or extensible plugin behavior. v1.3 only needs richer local structure.

### Browser: Internal Tabs And Session Snapshot

| Addition | Type | Why |
|----------|------|-----|
| `browserSessionModel.ts` | Internal TypeScript module | Represent tabs, active tab id, direct destinations, capped recents, and recoverable selected destination as pure data. |
| `browserSessionStorage.ts` | Internal localStorage adapter | Persist Browser state under the canonical browser storage namespace using `createAppStorageKey`. |
| Browser session storage version `1` | Internal storage contract | Establish parse/normalize behavior before tab state becomes hard to migrate. |

Use `localStorage`, not `sessionStorage`, because the requirement is recovery across relaunches or refreshes. Keep the snapshot small and capped: for example max 8 tabs, max 8 recent direct destinations, and no attempt to serialize iframe-internal history. Cross-origin iframe state remains opaque; openOS should persist only the destinations it controls and continue using the existing embedded versus external-fallback policy.

Do not add a browser history library, router, or service-worker storage layer. Browser tabs are app-local state, not URL routing.

### Core App State: Shared App-State Storage Helpers

| Addition | Type | Why |
|----------|------|-----|
| `appStateStorage.ts` or equivalent | Internal platform helper | Give built-in apps one consistent way to read/write small app UI state snapshots inside their app storage namespace. |
| App-level resume models | Internal per-app modules | Persist meaningful return context: Notes selected folder/note, Browser active tab, Catalog selected category/entry, Settings selected area if applicable, and Calculator display state if chosen for polish. |

Do not add Redux, Zustand, Jotai, XState, or another global state manager. The current shell opens one app surface at a time and app components unmount on close, so local app-state persistence is a storage concern, not a cross-app reactive state problem.

### Submitted Apps: Bun-Owned Metadata Generation/Check

| Addition | Type | Why |
|----------|------|-----|
| `scripts/generate-submitted-app-registry.ts` or `scripts/check-submitted-app-registry.ts` | Bun TypeScript script | Reduce manual registry upkeep while keeping the runtime/catalog and validator on the same source of truth. |
| Generated registry module or checked generated JSON | Internal generated artifact | Let the Browser bundle import a static registry while the Bun script discovers `src/features/platform/submitted-apps/*.json` from disk. |
| Unknown-input parser for manifests | Internal TypeScript parser | Validate raw JSON shapes before the existing business rules run, so malformed manifests produce field errors instead of crashes. |

Prefer generation/checking over Vite `import.meta.glob()` for the shared manifest source. Vite supports glob imports, but the docs identify it as Vite-only and not a web or ES standard; the existing `submissions:check` path is a Bun CLI that imports the shared manifest module. A Vite-only discovery primitive would split runtime and CLI behavior unless another path is added. A Bun-owned generator keeps the stack aligned with the repo and still removes most manual registry drift.

Do not add Zod, Ajv, or `json-schema-to-ts` yet. The manifest shape is small, the project already has focused validation, and Bright Builds guidance favors parsing at boundaries into domain types. Add JSON Schema later only if contributor IDE validation or external manifest publishing becomes a product requirement.

## What To Avoid

| Dependency or Change | Why Avoid In v1.3 | Revisit When |
|----------------------|-------------------|--------------|
| Rich-text editor framework | Adds large editing semantics before the product proves the structured-note model. Mobile contenteditable behavior, paste normalization, undo, and serialization would dominate the phase. | Inline marks, plugin editing, rich paste, or collaborative editing are explicitly required. |
| HTML note storage plus sanitizer | Creates security and migration complexity. A structured text model can render safely with React text nodes. | Users can paste or import trusted/untrusted HTML and preserving markup becomes required. |
| IndexedDB | Web Storage remains enough for small local notes and browser tabs. IndexedDB is better for large structured datasets and files, but v1.3 has no attachments or sync. | Notes add attachments, large documents, full-text indexing, or background sync. |
| Global state manager | App resume can be stored per app. There is no shared cross-app state graph that justifies a global dependency. | Multiple apps need live shared state, subscriptions, or background state machines. |
| Vite-only manifest discovery | Would not naturally serve the Bun CLI validator that currently protects submissions. | The submission workflow stops sharing code between runtime and Bun scripts, or the project intentionally accepts separate discovery paths. |
| Backend or account sync | Explicitly out of scope for v1.3. | Local Notes model is stable and sync/account requirements are prioritized. |

## Verification Stack

Keep and extend the current verification surface:

1. Add `verify:v1.3` as the new milestone command, modeled after `scripts/verify-v1.2.sh`.
2. Keep `bun run submissions:check` first, but make it also verify generated metadata is current.
3. Add Vitest coverage for pure Notes document transforms, Notes storage v2-to-v3 migration, Browser session parsing/normalization, app-state storage helpers, and submitted-manifest raw parsing/generation checks.
4. Add WebKit iPhone Playwright coverage for Notes structured editing persistence, Browser tab restore after refresh/relaunch path, and app resume context after closing/reopening an app.
5. Keep `bun run build` and explicit `bun x tsc --noEmit` in the milestone command.

## Installation

No new packages are recommended for v1.3.

Optional patch refresh, if scheduled as its own maintenance step:

```bash
bun update react react-dom @types/react @types/react-dom @vitejs/plugin-react typescript vite vitest @playwright/test
```

Run the full v1.3 verification command after any patch refresh, especially if Playwright changes.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| No new editor dependency | HIGH | Current requirement can be satisfied by structured local notes. Third-party editors solve a broader problem than v1.3 describes. |
| localStorage remains sufficient | MEDIUM-HIGH | MDN confirms Web Storage persists by origin and is widely available, but it is synchronous and should stay capped. IndexedDB should be revisited for large datasets or files. |
| No global state manager | HIGH | Current runtime unmounts one app surface at a time; per-app state snapshots address the actual loss of context. |
| Bun-owned submission workflow | HIGH | Existing validator is Bun TypeScript. Vite glob imports are Vite-specific, so generation/checking is a better shared path. |
| Optional patch refresh | MEDIUM | Package registry shows patch updates available; they are maintenance, not required feature enablers. |

## Sources

- Local project context: `.planning/PROJECT.md`
- Current dependency surface: `package.json`, `bun.lock`, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts`
- Notes implementation: `src/features/apps/notes/NotesApp.tsx`, `notesModel.ts`, `notesStorage.ts`, and tests
- Browser implementation: `src/features/apps/browser/BrowserApp.tsx`, `BrowserFrame.tsx`, `browserDestinations.ts`, and tests
- Submitted apps workflow: `src/features/platform/submittedAppManifests.ts`, `scripts/validate-submitted-apps.ts`, `docs/app-submissions.md`
- Runtime/app state context: `src/features/shell/AdaptiveShellFoundation.tsx`, `src/features/runtime/homeScreenRuntime.ts`, `src/features/platform/appStorage.ts`
- Bright Builds standards: `AGENTS.md`, `AGENTS.bright-builds.md`, pinned `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/verification.md`, `standards/core/testing.md`, and `standards/languages/typescript-javascript.md`
- MDN Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN IndexedDB API: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN `contenteditable`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable
- MDN `execCommand()` deprecation: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
- MDN `<iframe>` sandbox and same-origin notes: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
- Vite glob import docs: https://vite.dev/guide/features.html#glob-import
- React reference: https://react.dev/reference/react
