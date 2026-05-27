# Architecture Research: v1.3 Stateful Apps & Platform Maturity

**Domain:** Local-first mobile web app platform
**Researched:** 2026-05-27
**Overall confidence:** HIGH

## Scope Note

The prompt listed `src/features/notes/*`, `src/features/browser/*`, `src/features/submissions/*`, and `src/features/library/*`. Those paths are stale. The current codebase owns those surfaces under:

- `src/features/apps/notes/*`
- `src/features/apps/browser/*`
- `src/features/apps/catalog/*`
- `src/features/platform/submitted-apps/*`
- `src/features/platform/submittedAppManifests.ts`

This report is based on the current modules plus the v1.3 milestone context, launcher/runtime tests, and Bright Builds architecture standards.

## Executive Recommendation

v1.3 should deepen app state without moving app-specific state into the shell. Keep the platform/runtime seam as it is today: `appDefinitions.ts` defines app identity, placement, Settings participation, storage namespace, availability, and launch surface; `appRegistry.ts` exposes selectors; the shell opens an app by id and renders by `launchSurface`; each app owns its domain model, storage adapter, and UI state restoration inside its app module.

The main architectural move is to formalize a bounded "app session snapshot" pattern, not a broad new runtime state framework. Use existing storage namespaces from `appStorage.ts`, add small helper conventions only where repetition proves it, and keep the shell's `HomeScreenRuntimeState` focused on navigation, active page, origin page, and motion. Notes, Browser, Calculator, Library, and Settings should decide what "resume meaningful context" means for their own domain.

For submitted apps, reduce manual registry drift by making checked-in JSON manifests the source and generating a deterministic TypeScript registry consumed by the existing platform selectors. Do not use Vite-only dynamic glob APIs in the shared manifest module while the Bun validation script imports that same module directly.

## Current Architecture

### Runtime Platform Flow

```text
src/features/platform/appDefinitions.ts
  -> builtInAppDefinitions
  -> src/features/runtime/appRegistry.ts selectors
  -> HomeScreenPages / Dock launch buttons
  -> openRuntimeApp(appId)
  -> AdaptiveShellFoundation chooses component by launchSurface
  -> AppSurface exposes runtime metadata attributes
  -> app module owns behavior and storage
```

The current seam is strong and should be preserved:

- `RuntimeAppDefinition` is shared platform metadata, not app implementation state.
- `launchSurface` deduplicates multiple launcher entries that open the same app, especially Browser grid and dock.
- `storage.namespace` is already the correct ownership boundary for local app data.
- Settings uses `listCanonicalRuntimeAppsForSettings()` so duplicate Browser launchers collapse into one managed app.
- `AppSurface` exposes metadata through `data-*` attributes for integration tests and runtime clarity.

### Existing App State Shape

| App | Persistent domain data today | Ephemeral UI state today | v1.3 issue |
| --- | --- | --- | --- |
| Notes | `openos.apps.notes.notes` snapshot v2 with folders and notes | selected folder, selected note, search draft | Rich content needs migration; resume should restore selected context |
| Browser | none | selected destination, recents, address draft | Tabs/session must persist across grid/dock launcher paths and refresh |
| Settings | shell preferences in settings storage | current scroll/section only | Preferences already persist; app-management view can remain simple |
| Library | submitted manifest data from platform modules | selected category and entry | Resume can restore selected category/detail if included in polish |
| Calculator | reducer state in component memory | whole calculator session | Resume likely means retaining display/pending operation after returning home |

## Recommended Architecture

### 1. Keep Runtime State Thin

`HomeScreenRuntimeState` should remain a launcher/navigation model:

```typescript
type HomeScreenRuntimeState = HomeNavigationState & {
  activePage: number;
  originPage: number | null;
};
```

Do not add Notes selected ids, Browser tabs, Calculator display state, or Library selection state here. The shell should answer "what app is open and how did it animate?", not "what does every app contain?"

### 2. Use App-Owned Session Snapshots

Each app that needs resume behavior should add a small session storage adapter under its own module and use the canonical namespace:

```text
openos.apps.notes.session
openos.apps.browser.session
openos.apps.calculator.session
openos.apps.library.session
```

Use `createAppStorageKey(namespace, "session")` rather than inventing parallel key formats. Add a shared helper only if at least two adapters repeat the same versioned parse/write boilerplate.

Recommended contract:

```typescript
type VersionedSnapshot<TVersion extends number> = {
  version: TVersion;
};

type AppSessionAdapter<TSession> = {
  read(storage: Storage, namespace: string): TSession;
  write(storage: Storage, namespace: string, session: TSession): void;
};
```

This should stay a convention or tiny helper, not a generic framework that knows app-specific fields.

### 3. Keep Functional Core / Imperative Shell Boundaries

Follow this split consistently:

| Layer | Owns | Examples |
| --- | --- | --- |
| Pure model | domain decisions, normalization, reducers, filtering, migration from parsed data | `notesModel.ts`, `browserDestinations.ts`, new `browserSessionModel.ts` |
| Storage adapter | localStorage keys, JSON parse/write, version migration, bad payload recovery | `notesStorage.ts`, new `browserSessionStorage.ts` |
| React shell | DOM events, local input drafts, effects/subscriptions, rendering | `NotesApp.tsx`, `BrowserApp.tsx`, `AppCatalogApp.tsx` |
| Platform metadata | app identity, storage namespace, Settings visibility, placement, launch surface | `appDefinitions.ts`, `appRegistry.ts` |

Pure model changes should have Vitest coverage. React shells should be covered through existing Playwright launcher-path tests when user-facing behavior matters.

## Component Boundaries

| Component | Responsibility | New or Modified | Communicates With |
| --- | --- | --- | --- |
| `appDefinitions.ts` | Stable built-in app metadata | Mostly unchanged | `appRegistry.ts`, shell, Settings |
| `appStorage.ts` | Namespace/key helpers | Maybe add narrow session-key helper | App storage adapters |
| `appRegistry.ts` | Canonical runtime selectors | Mostly unchanged; tests may expand | Shell, app modules, Settings |
| `homeScreenRuntime.ts` | Launcher navigation and motion state | Mostly unchanged | `AdaptiveShellFoundation.tsx`, motion layer |
| `AdaptiveShellFoundation.tsx` | Chooses app component by `launchSurface` | Maybe minor component extraction only | Runtime state, app components |
| `NotesApp.tsx` | Notes UI shell | Modified | notes model/storage/session |
| `notesModel.ts` | Notes domain operations | Modified | notes storage/tests/UI |
| `notesStorage.ts` | Notes snapshot parsing/migration | Modified | localStorage via namespace |
| `notesSessionStorage.ts` | Selected note/folder/view resume state | New | `NotesApp.tsx`, localStorage |
| `browserDestinations.ts` | URL parsing and truthful render-mode classification | Modified only if tab model needs small helpers | browser session model/UI |
| `browserSessionModel.ts` | Tab reducer, active tab, recents, navigation decisions | New | `BrowserApp.tsx`, storage tests |
| `browserSessionStorage.ts` | Browser session parse/write/migration | New | localStorage via Browser namespace |
| `BrowserApp.tsx` | Browser tabs/address UI shell | Modified | destination/session model/storage |
| `BrowserFrame.tsx` | Embedded destination frame | Mostly unchanged | selected tab destination |
| `submittedAppManifests.ts` | Manifest validation and selectors | Modified | generated registry, Library, validation script |
| `submittedAppRegistry.generated.ts` | Deterministic imports from JSON manifests | New generated file | `submittedAppManifests.ts` |
| `scripts/generate-submitted-app-registry.ts` | Generate/check submitted manifest registry | New | filesystem, validation workflow |
| `AppCatalogApp.tsx` | Catalog browsing UI | Maybe modified for session restore | platform manifest selectors |
| `scripts/verify-v1.3.sh` | Milestone aggregate verification | New | submissions, unit tests, typecheck, build, e2e |

## Data Flow Recommendations

### Notes Rich Editing

Current Notes storage is a v2 snapshot with `folders` and `notes`; each `Note` has `title`, `body`, `folderId`, `createdAt`, and `updatedAt`.

Recommended v1.3 flow:

```text
localStorage openos.apps.notes.notes
  -> notesStorage.parseSnapshot()
  -> migrate v1/v2 payloads to v3
  -> notesModel normalizes content/folders/notes
  -> NotesApp renders editor/list/folder state
  -> edit actions call pure model/storage functions
  -> notesSessionStorage persists selected folder/note/editor mode
```

Use a typed content model instead of storing raw `contenteditable` HTML as the canonical note body:

```typescript
type NoteContent =
  | { kind: "plain-text"; text: string }
  | { kind: "blocks"; blocks: NoteBlock[]; plainText: string };

type NoteBlock =
  | { id: string; kind: "paragraph"; text: string }
  | { id: string; kind: "heading"; text: string }
  | { id: string; kind: "check"; text: string; checked: boolean };
```

Why this shape:

- Preserves existing notes by migrating `body` into `plain-text`.
- Keeps search and previews stable through a plain-text projection.
- Avoids coupling stored data to browser DOM/editor implementation details.
- Leaves room for future sync because blocks have ids and explicit kinds.

If v1.3 chooses Markdown-style formatting instead, still parse it through `notesModel.ts` helpers and keep search/preview as pure projections. Do not let formatting logic live only inside `NotesApp.tsx`.

### Browser Tabs and Session State

Current Browser state is entirely component-local. v1.3 should introduce a session model around the existing destination classifier.

Recommended flow:

```text
Browser grid or dock launcher
  -> shared launchSurface "browser"
  -> canonical namespace openos.apps.browser
  -> browserSessionStorage.read()
  -> BrowserApp renders tab strip, address bar, frame/fallback
  -> address submit calls createDirectBrowserDestination()
  -> browserSessionModel.navigateActiveTab()
  -> browserSessionStorage.write()
```

Keep `BrowserDestination.renderMode` as the truthful browsing boundary:

- same-origin/local openOS paths can be `embedded`
- external or untrusted http(s) destinations should remain `external-fallback`
- unsupported protocols should stay invalid

Recommended session shape:

```typescript
type BrowserSessionSnapshot = {
  version: 1;
  activeTabId: string;
  tabs: BrowserTab[];
  recentDestinations: BrowserDestination[];
};

type BrowserTab = {
  id: string;
  destination: BrowserDestination;
  createdAt: string;
  updatedAt: string;
};
```

Use pure reducers/actions for tab behavior:

```typescript
type BrowserSessionAction =
  | { kind: "open-tab"; destination: BrowserDestination; tabId: string; now: string }
  | { kind: "close-tab"; tabId: string }
  | { kind: "select-tab"; tabId: string }
  | { kind: "navigate-active-tab"; destination: BrowserDestination; now: string };
```

Cap tabs and recents early. A small cap, such as 8 tabs and 8 recents, is enough for the iPhone shell and prevents localStorage growth from becoming a hidden product problem.

### Submitted App Metadata Workflow

Current workflow manually imports each JSON manifest into `submittedAppManifests.ts` and then detects drift by comparing discovered files with the registry.

Recommended v1.3 flow:

```text
src/features/platform/submitted-apps/*.json
  -> scripts/generate-submitted-app-registry.ts
  -> src/features/platform/submittedAppRegistry.generated.ts
  -> submittedAppManifests.ts validators/selectors
  -> appCatalogModel.ts category/filter selectors
  -> AppCatalogApp.tsx
```

Make the generated file deterministic:

- sort by manifest id or source filename
- import every JSON file explicitly
- export `{ manifest, sourceFile }[]`
- include a generated-file header
- fail `submissions:check` if generation is stale

Do not replace this with `import.meta.glob` inside `submittedAppManifests.ts` unless the validation script is also moved to a Vite-aware execution path. The current validation script runs under Bun and imports the platform module directly.

Validation should remain in `submittedAppManifests.ts` so Library and scripts share the same rules. Expand validation for:

- duplicate ids
- duplicate runtime launch ids
- source filename matching `<id>.json`
- catalog-ready requiring `review.reviewedAt`
- storage namespace matching `openos.apps.submitted.<id>`
- hidden Settings participation until install support exists

### Core App-State Polish

Use app-owned session snapshots for "resume meaningful context":

| App | Suggested v1.3 resume behavior | Storage key |
| --- | --- | --- |
| Notes | selected folder, selected note, editor mode, maybe last search if product wants search continuity | `openos.apps.notes.session` |
| Browser | tabs, active tab, direct recents, address draft only if valid/useful | `openos.apps.browser.session` |
| Calculator | display, pending value/operator, waiting-for-operand state; reset corrupt or very stale sessions | `openos.apps.calculator.session` |
| Library | selected category and selected entry id | `openos.apps.library.session` |
| Settings | no broad session needed; preferences already persist | existing settings preferences |

This approach preserves the runtime seam: the shell opens and closes apps; app modules decide what context to restore.

## Patterns To Follow

### Pattern 1: Versioned Local Snapshots

**What:** Store versioned JSON snapshots and parse them into normalized domain values.

**When:** Notes content, Browser session, Calculator session, Library session.

**Example:**

```typescript
type BrowserSessionSnapshot = {
  version: 1;
  activeTabId: string;
  tabs: BrowserTab[];
  recentDestinations: BrowserDestination[];
};

function parseBrowserSessionSnapshot(
  maybeValue: string | null,
): BrowserSessionSnapshot {
  if (maybeValue === null) {
    return createDefaultBrowserSessionSnapshot();
  }

  // parse, validate, normalize, recover to default on bad payload
}
```

### Pattern 2: Canonical Launch Surface for Shared App Identity

**What:** Multiple launcher entries can point at one app identity by sharing `launchSurface` and `storage.namespace`.

**When:** Browser grid and dock entries.

**Rule:** Browser tabs/session must always use `getCanonicalRuntimeAppStorageNamespace("browser")` or equivalent canonical metadata, not the clicked app id.

### Pattern 3: App Module Owns Domain State

**What:** Keep app-specific storage and reducers inside app modules.

**When:** Notes, Browser, Calculator, Library.

**Rule:** Add `browserSessionModel.ts` and `browserSessionStorage.ts`; do not add `browserTabs` to runtime shell state.

### Pattern 4: Platform Selectors Feed Product Surfaces

**What:** Library, Settings, shell preview, and validation scripts should consume selectors from platform/runtime modules.

**When:** Submitted app manifests and Settings app-management surfaces.

**Rule:** Keep `AppCatalogApp.tsx` a consumer of `listCatalogReadySubmittedApps()`, not a second validator or manifest registry.

## Anti-Patterns To Avoid

### Anti-Pattern 1: Shell-Owned App Payloads

**What:** Extending `HomeScreenRuntimeState` with arbitrary per-app payloads.

**Why bad:** The shell becomes a central state dump, app changes require runtime changes, and tests lose the clean platform seam.

**Instead:** Persist app-owned session snapshots under each app namespace.

### Anti-Pattern 2: Raw Rich-Text HTML as Canonical Notes Data

**What:** Storing editor DOM/HTML as the note source of truth.

**Why bad:** It couples persistence to one UI implementation, weakens search/migration, and makes future sync harder.

**Instead:** Store typed blocks or a plain-text/Markdown source plus pure projections for preview/search.

### Anti-Pattern 3: Duplicate Browser State Per Launcher Icon

**What:** Using `browser-grid` and `browser` as separate storage identities.

**Why bad:** The existing architecture deliberately gives both launchers `launchSurface: "browser"` and `openos.apps.browser`.

**Instead:** Route Browser session reads/writes through the canonical Browser namespace.

### Anti-Pattern 4: Vite-Only Manifest Discovery in Shared Platform Code

**What:** Using `import.meta.glob` in `submittedAppManifests.ts` while scripts import it directly under Bun.

**Why bad:** It can work in the app bundle and fail in validation, recreating the drift risk under a different mechanism.

**Instead:** Generate a deterministic TS registry from JSON files and check it in or verify it in `submissions:check`.

### Anti-Pattern 5: Catalog-Specific Manifest Validation

**What:** Revalidating submitted app metadata inside Library because the catalog needs safer data.

**Why bad:** Rules diverge between scripts and product.

**Instead:** Keep validation/selectors in `submittedAppManifests.ts`; Library consumes filtered valid entries.

## Suggested Phase Ordering

### Phase 1: App Session Contract and Verification Baseline

Rationale: Notes and Browser both need local resume behavior. Establish the storage/session convention first so later phases do not invent incompatible keys.

Build:

- document or implement a tiny app-session storage helper if needed
- add tests for canonical Browser namespace and storage key expectations
- add `verify:v1.3` skeleton or update milestone verification plan

Avoids:

- shell-owned app payloads
- duplicate Browser grid/dock state

### Phase 2: Notes Rich Content Model and Migration

Rationale: Notes has the highest migration risk because existing user data must survive. Start with pure model/storage before UI.

Build:

- `NoteContent`/block model or chosen rich structure
- v2-to-v3 migration in `notesStorage.ts`
- search/preview/title projections from new content
- unit tests for old payloads, invalid payloads, structured notes, search

Avoids:

- losing existing notes
- UI-only formatting logic

### Phase 3: Notes Editor and Resume Integration

Rationale: Once the model is safe, wire richer editing and selected context restoration into the app shell.

Build:

- richer editor controls/views in `NotesApp.tsx`
- `notesSessionStorage.ts` for selected folder/note/editor mode
- Playwright launcher-path test proving create/edit/reopen/refresh

Avoids:

- mixing migration and UI complexity in one phase

### Phase 4: Browser Tabs and Session Storage

Rationale: Browser can reuse the session convention and must preserve truthfulness around embed/fallback behavior.

Build:

- `browserSessionModel.ts` pure reducer/actions
- `browserSessionStorage.ts` versioned snapshot parser
- tab strip and active-tab address behavior in `BrowserApp.tsx`
- tests proving grid/dock share one tab session and refresh restores active context

Avoids:

- external iframe overclaims
- losing direct navigation state

### Phase 5: Submitted Metadata Generation and Validation Hardening

Rationale: This is independent from app state but should land before broader catalog/install work. It removes manual upkeep from the platform metadata flow.

Build:

- generated submitted-app registry
- generator/check script
- expanded duplicate/source-file validation
- Library still consuming existing selectors

Avoids:

- registry drift
- catalog and validation disagreement

### Phase 6: Core App-State Polish and Integrated Regression

Rationale: Finish by applying the session pattern to smaller built-in app contexts and locking the milestone with one launcher-path suite.

Build:

- Calculator session persistence if selected for v1.3 polish
- Library selected category/detail resume if selected
- Settings app-management copy/tests only if metadata workflow changes visible state
- `verify:v1.3` aggregate command
- integrated Playwright flow across Notes, Browser tabs, Library metadata, Settings

Avoids:

- polishing each app differently without a shared convention
- shipping stateful behavior without launcher-path proof

## Scalability Considerations

| Concern | Now | Later Trigger | Future Direction |
| --- | --- | --- | --- |
| Notes storage | Full snapshot in localStorage is acceptable | hundreds/thousands of notes, attachments, sync | move to IndexedDB with same pure model/storage boundary |
| Notes search | In-memory filter is acceptable | large note corpus | add derived search index in storage adapter, not React UI |
| Browser tabs | Store capped sessions in localStorage | many tabs/history entries | cap first; later add IndexedDB/history model if product needs it |
| Submitted apps | Generated registry is simple and deterministic | dozens/hundreds of apps | generated category indexes or lazy chunks |
| Shell runtime | Single open app is fine | true multitasking/windowing | introduce task model only when product scope requires it |

## Verification Strategy

Unit tests:

- Notes content migration, normalization, preview, search
- Browser session reducer, tab close/select/navigate, corrupt session recovery
- Submitted manifest generated registry and validation
- Calculator session parser if implemented
- Library session parser if implemented

Playwright tests:

- Notes rich edit survives app close/reopen and page reload
- Browser opens multiple tabs, switches tabs, restores active tab after reload
- Browser grid and dock share one session namespace
- External Browser destination still shows fallback and correct Safari link
- New submitted manifest workflow feeds Library without manual catalog edits
- Integrated launcher path: Notes -> Browser -> Library -> Settings -> return-home page restoration

Aggregate verification:

```bash
bun run submissions:check
bun run test
bun x tsc --noEmit
bun run build
bun run test:e2e --project=webkit-iphone
```

Prefer a checked-in `scripts/verify-v1.3.sh` mirroring the v1.2 aggregate command.

## Roadmap Implications

- Start with state/storage contracts because Notes and Browser both depend on them.
- Treat Notes migration as an early phase because data preservation is the highest risk.
- Build Browser tabs after the session pattern exists so grid/dock sharing stays obvious.
- Move submitted-app workflow hardening before any install expansion, but it does not need to block Notes/Browser unless the team wants strict serial phases.
- Save broad app-state polish and e2e integration for the final phase because it depends on knowing which state conventions survived implementation.

## Confidence Assessment

| Area | Confidence | Notes |
| --- | --- | --- |
| Runtime/platform seams | HIGH | Directly verified in `appDefinitions.ts`, `appStorage.ts`, `appRegistry.ts`, `homeScreenRuntime.ts`, and shell tests |
| Notes architecture | HIGH | Existing model/storage split is clear and already versioned |
| Browser architecture | HIGH | Existing destination classifier cleanly supports tabs/session above it |
| Submitted metadata workflow | MEDIUM-HIGH | Current drift detector is clear; generated registry recommendation is architectural, not yet implemented |
| Core app-state polish | MEDIUM | Requirement says "meaningful context" but exact app-by-app UX choices still need phase discussion |

## Sources

- `.planning/PROJECT.md`
- `.planning/MILESTONES.md`
- `src/features/platform/appDefinitions.ts`
- `src/features/platform/appStorage.ts`
- `src/features/runtime/appRegistry.ts`
- `src/features/runtime/homeScreenRuntime.ts`
- `src/features/shell/AdaptiveShellFoundation.tsx`
- `src/features/apps/notes/*`
- `src/features/apps/browser/*`
- `src/features/apps/catalog/*`
- `src/features/platform/submittedAppManifests.ts`
- `src/features/platform/submitted-apps/*.json`
- `tests/e2e/*`
- Bright Builds standards at pinned commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: architecture, code shape, verification, testing, TypeScript/JavaScript
