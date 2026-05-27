# Domain Pitfalls

**Domain:** v1.3 Stateful Apps & Platform Maturity
**Researched:** 2026-05-27
**Overall confidence:** HIGH for project-specific risks; MEDIUM for browser-platform limits that require device/browser validation.

## Research Basis

Required context reviewed:

- `.planning/PROJECT.md`
- `.planning/RETROSPECTIVE.md`
- `.planning/milestones/v1.2-MILESTONE-AUDIT.md`
- `.planning/milestones/v1.2-phases/21-submitted-manifest-discovery-hardening/21-VERIFICATION.md`
- `.planning/milestones/v1.2-phases/22-browser-launcher-identity-cleanup/22-VERIFICATION.md`

Additional repo surfaces inspected:

- Notes: `src/features/apps/notes/NotesApp.tsx`, `notesStorage.ts`, `notesModel.ts`, `notesStorage.test.ts`, `tests/e2e/notes.spec.ts`
- Browser: `src/features/apps/browser/BrowserApp.tsx`, `browserDestinations.ts`, `BrowserFrame.tsx`, `tests/e2e/browser-app.spec.ts`
- Runtime/platform: `appDefinitions.ts`, `appStorage.ts`, `appRegistry.ts`, `homeScreenRuntime.ts`, `AdaptiveShellFoundation.tsx`
- Submissions/catalog: `submittedAppManifests.ts`, `scripts/validate-submitted-apps.ts`, `docs/app-submissions.md`, `AppCatalogApp.tsx`
- Verification: `scripts/verify-v1.2.sh`, integration E2E specs

Material standards loaded:

- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`
- Bright Builds architecture, code shape, verification, testing, and TypeScript/JavaScript standards

## Executive Risk Summary

v1.3 is not primarily a feature-count milestone. It is a state-contract milestone. Notes rich structure, Browser tabs/session restore, safer submitted-app metadata, and core app-state resume all increase the amount of local state that must survive return-home, reload, malformed storage, and future model migration.

The strongest roadmap guardrail is ordering: define durable state models and migrations before UI expansion; then build app-specific UI; then add integration verification. If the roadmap starts with rich editor widgets or tab chrome before storage contracts, v1.3 will likely ship visible features that reset, split by launcher path, or silently corrupt older data.

## Critical Pitfalls

### Pitfall 1: Treating richer Notes editing as a UI-only change

**What goes wrong:** A formatting toolbar, `contenteditable`, Markdown preview, checklist UI, or nested outline is added directly to `NotesApp.tsx` while the storage model remains a flat `{ title, body, folderId }` note.

**Why it happens:** The current app is a useful v1.2 implementation, but it is intentionally simple: `Note.body` is a string, search reads title/body text, and storage is version `2`. `NotesApp.tsx` is already about 686 lines, so adding editor behavior there will mix UI state, migration, search indexing, formatting, and persistence in one surface.

**Consequences:**

- Existing v1.1/v1.2 notes can disappear or lose structure if the parser rejects old snapshots.
- Search, previews, and folder counts drift if rich content does not have a canonical plaintext/search projection.
- Raw HTML storage creates sanitization and paste-handling risk.
- iPhone text editing can feel fake if selection, keyboard behavior, and layout are not tested through the real app shell.

**Prevention:**

- First Notes phase should define a `NotesSnapshot` v3 model before editor UI. Use discriminated types for note content, for example plain text plus a constrained local structure, not arbitrary HTML.
- Keep a derived `searchText`/preview path or pure serializer so search remains data-in/data-out and cheap to unit test.
- Provide explicit migration tests for: missing payload, legacy array payload, v2 folder payload, duplicate IDs, invalid rich blocks, and unknown future fields.
- Prefer constrained structures that map well to mobile editing, such as sections, checklists, or lightweight formatting tokens. Avoid a broad WYSIWYG/contenteditable editor unless the phase is explicitly about editor engine complexity.
- Keep the local-only warning visible and update copy only to describe the richer local model, not sync or recovery.

**Detection:**

- `notesStorage.ts` has no new versioned migration tests.
- `NotesApp.tsx` grows substantially while no pure model module absorbs rich content rules.
- E2E proves only new note creation, not reload of pre-v1.3 stored data.
- Search results miss formatted/checklist content.

**Suggested phase ownership:** First Notes foundation phase owns data model, migration, plaintext projection, and tests. A later Notes UI phase owns editor controls and mobile layout.

**Confidence:** HIGH.

### Pitfall 2: Persisting app state only in mounted React component state

**What goes wrong:** Browser tabs, selected Notes folder/note, search query, Catalog category/detail selection, or Settings panel position are kept in `useState` only. They appear to work until the user taps Home, relaunches, or refreshes.

**Why it happens:** `AdaptiveShellFoundation` conditionally renders the app surface for the open app. When an app leaves the tree, React discards component state. React documents this as normal behavior: state is preserved only while the same component remains rendered at the same tree position.

**Consequences:**

- The v1.3 requirement "return to core built-in apps and resume meaningful local app state" is missed even if individual apps look functional in a single open session.
- Browser recents/tabs reset because current Browser state is all component-local.
- Notes reloads durable notes but resets context such as selected folder, selected note, and query.
- Developers invent separate per-app hacks instead of one platform-level app-state contract.

**Prevention:**

- Add a shared app-state primitive before broad app polish: `openos.apps.<canonical>.state` or equivalent, with app-owned parsers and defaults.
- Distinguish durable content from resumable UI context. Notes content is durable; selected note/folder/search can be resumable context. Browser tabs/session are durable enough to restore, but iframe loaded documents are not.
- Parse persisted state at boundaries into typed domain models. Do not pass raw JSON shapes through components.
- Store state by canonical app identity, not launcher placement id.
- Add launch-return-relaunch tests for each app that gets "resume" behavior.

**Detection:**

- New v1.3 state appears only as `useState` in app components.
- E2E does not tap Home and relaunch the app before asserting restore.
- No parser tests exist for malformed state payloads.

**Suggested phase ownership:** A core app-state runtime phase should define the persistence/resume contract. Notes, Browser, Catalog, and Settings phases should consume it rather than each inventing storage.

**Confidence:** HIGH.

### Pitfall 3: Reintroducing Browser split identity while adding tabs

**What goes wrong:** Browser tab/session state is keyed by `browser-grid` for the grid icon and `browser` for the dock icon, creating two independent Browsers after Phase 22 explicitly made storage identity shared.

**Why it happens:** v1.2 deliberately kept two launcher ids for one canonical Browser runtime surface. Phase 22 fixed storage aliasing to `openos.apps.browser`, but downstream code still has to distinguish launcher placement identity from canonical app identity.

**Consequences:**

- A tab opened from the dock is missing from the grid Browser.
- Settings or app-state rows duplicate Browser again.
- Browser tests pass for one entrypoint and fail for the other.
- Future platform install/launch semantics inherit a bad identity split.

**Prevention:**

- Browser tabs must use canonical launch surface/storage namespace, not the current app id.
- The tab-session model should be named around Browser domain concepts, not launcher entry concepts.
- Keep the existing Phase 22 assertions and expand them: create tabs from `browser-grid`, return home, open `browser`, verify same tab/session; repeat the reverse path.
- Add unit tests proving browser tab storage helpers accept the canonical namespace and do not derive from placement id.

**Detection:**

- Code stores keys containing `browser-grid`.
- `getRuntimeAppStorageNamespace("browser-grid")` is used where `getCanonicalRuntimeAppStorageNamespace("browser")` should be used.
- E2E opens only one Browser launcher in tab/session tests.

**Suggested phase ownership:** Browser tabs/session phase owns this, with dependency on the core app-state/runtime phase.

**Confidence:** HIGH.

### Pitfall 4: Browser tabs imply fake Safari parity

**What goes wrong:** The tab UI makes external sites look loaded inside openOS, or stores titles/favicons/history for pages that the shell cannot actually inspect or embed.

**Why it happens:** Tabs are visually associated with real browsers. The current Browser stays truthful because `BrowserDestination.renderMode` is explicit: same-origin paths can embed; unknown external sites use `external-fallback`. Rich tab UI can accidentally blur that distinction.

**Consequences:**

- Product copy violates the truthfulness bar established in v1.1/v1.2.
- Users believe remote pages are loaded in the shell when only a fallback card exists.
- E2E proves tab switching but not honest fallback semantics.
- Future install/browser work is built on overclaimed capability.

**Prevention:**

- Model each tab with `renderMode: "embedded" | "external-fallback"` and store the render mode in session state.
- External tabs should restore to a fallback card with a clear Safari handoff, not an iframe or fake loading page.
- Do not claim back/forward, page title extraction, favicon extraction, login continuity, or remote page state unless separately proven.
- Keep curated same-origin fixtures for embedded tab tests and remote destinations for fallback tab tests.
- Keep copy close to the current language: direct entry works, inline browsing is limited to destinations openOS knows it can render.

**Detection:**

- Browser tab data stores URL only, with no render mode or source.
- A remote tab creates an iframe.
- UI says "Open in Browser" or "Loaded" for external fallback tabs.
- Tests do not assert `browser-fallback` after reload/restore of external tabs.

**Suggested phase ownership:** Browser tabs/session phase owns the model and UX copy. Final integration phase owns regression across embedded and fallback tabs.

**Confidence:** HIGH.

### Pitfall 5: Ignoring local storage quota, blocked persistence, and write failures

**What goes wrong:** Rich notes and Browser sessions continue to call `localStorage.setItem` directly. A quota or policy error throws during typing, tab creation, or migration and breaks the app surface.

**Why it happens:** v1.2 storage helpers assume small string snapshots. MDN documents Web Storage limits and `QuotaExceededError`; `localStorage` can also throw `SecurityError` when persistence is blocked by policy.

**Consequences:**

- Notes editing can crash or silently fail once richer content grows.
- A failed migration can leave the user with no visible recovery path.
- Browser tab creation appears successful but does not restore after reload.
- Test coverage misses the failure because current in-memory storage mocks never throw.

**Prevention:**

- Introduce storage adapters that return typed success/failure results for read, write, remove, parse, and migration.
- Unit test quota/write-failure behavior with throwing storage mocks.
- Keep rich Notes structures compact; do not store rendered HTML, screenshots, or remote page cache in v1.3.
- Add user-visible degraded states for "local storage unavailable" and "could not save latest change."
- Defer IndexedDB or larger storage migration unless a v1.3 phase explicitly scopes it; do not switch storage engines incidentally.

**Detection:**

- New code calls `window.localStorage.setItem` directly from app components.
- No tests simulate `setItem` throwing.
- Rich notes store both source and redundant rendered HTML.
- The roadmap does not mention a storage failure UX.

**Suggested phase ownership:** Core app-state/storage foundation owns adapter behavior. Notes and Browser phases own user-facing failure states for their surfaces.

**Confidence:** HIGH for risk; MEDIUM for exact iOS storage behavior without device validation.

### Pitfall 6: Making submitted-app metadata safer by adding another source of truth

**What goes wrong:** The workflow adds generated files, schema files, docs tables, and runtime imports that can drift independently. The system becomes more complex but not safer.

**Why it happens:** v1.2 already closed silent omission by failing when manifest JSON files and `submittedAppManifests.ts` diverge. The remaining pain is manual registry upkeep. A naive fix can create a second registry instead of eliminating or generating the existing one.

**Consequences:**

- Contributors still edit multiple places.
- Catalog-ready filtering and CLI validation disagree.
- `bun run submissions:check` passes one path while the in-product Library reads another.
- Future install escape hatch inherits untrusted metadata.

**Prevention:**

- Pick one source-of-truth strategy:
  - Preferred: manifest JSON files are authoritative; a Bun script generates a checked-in typed registry, and `submissions:check` fails if generated output is stale.
  - Acceptable: keep manual registry, but add a scaffold command that writes the JSON and registry entry together, then validates drift.
- Runtime should import a typed generated module or the existing registry, not perform filesystem discovery in browser code.
- Keep validator, catalog-ready filtering, docs, and generated registry on the same manifest type.
- Add a fixture test for "new manifest appears in catalog after generation/check" instead of only testing drift detection.

**Detection:**

- More than one hand-maintained list of submitted apps exists.
- Catalog imports sample manifests directly while validator imports a different collection.
- Generation changes are not checked in or not validated in CI.

**Suggested phase ownership:** Submitted metadata workflow phase owns source-of-truth, scaffold/generation, docs, and validator alignment.

**Confidence:** HIGH.

### Pitfall 7: Weakening review/trust boundaries while streamlining submissions

**What goes wrong:** "Safer workflow" becomes "easier to mark catalog-ready" or starts implying submitted apps are installable/launchable.

**Why it happens:** Platform workflow maturity can be mistaken for marketplace maturity. The project is intentionally repo-driven and metadata-first; arbitrary install remains out of scope.

**Consequences:**

- Unreviewed manifests leak into Library.
- Library copy implies installation or activation before the runtime can support it.
- Settings visibility or storage namespaces are broadened before submitted apps have real lifecycle semantics.
- Trust and moderation questions enter v1.3 without a backend or review process.

**Prevention:**

- Treat submission status as a state machine: draft -> reviewed/catalog-ready. Make invalid transitions unrepresentable or validator-failing.
- Keep `runtime.settings.visibility` hidden for submitted apps until a later install/catalog phase explicitly changes the contract.
- Keep Library copy browse-only and review-oriented.
- Add validator rules for any new metadata that affects user trust, such as review status, source URL, permissions, storage namespace, and capability claims.

**Detection:**

- `catalog-ready` can be set without review metadata.
- Library buttons use install/open language.
- Submitted apps appear in Settings as managed apps.

**Suggested phase ownership:** Submitted metadata workflow phase owns this, with final verification checking Library copy and Settings boundaries.

**Confidence:** HIGH.

### Pitfall 8: Stateful features overcrowd the strict iPhone illusion

**What goes wrong:** Notes toolbars, Browser tab strips, validation status, and app-state indicators make the app feel like a desktop web dashboard inside an iPhone frame.

**Why it happens:** v1.3 adds denser workflows to screens already carrying app-surface chrome and explanatory copy. Current Notes and Browser designs are usable, but richer editing and tabs add persistent controls that compete with the illusion.

**Consequences:**

- Small portrait iPhone screens get clipped controls, overlapping text, or unusable editor/tabs.
- Keyboard focus pushes critical controls out of reach.
- App-state restore feels correct technically but visually jarring.
- The milestone regresses the core value even though tests pass.

**Prevention:**

- Require each app phase to define its small-screen control hierarchy before implementation.
- Use compact mobile-native controls: segmented formatting where needed, horizontal scroll for tabs only with stable dimensions, bottom-safe actions when appropriate, and no dashboard-like panels.
- Keep explanatory copy minimal after the first successful stateful behavior lands.
- Add WebKit iPhone screenshots for Notes editor, Browser tabs with at least three tabs, fallback tab, Settings/Library metadata states, and return-home-reopen flows.
- Test at smallest supported portrait profile and with long folder names, long note titles, and long URLs.

**Detection:**

- A phase adds controls but no screenshot or layout assertion.
- Text wraps into buttons or tab labels resize the layout.
- Rich editor controls are always visible and consume more vertical space than the content.

**Suggested phase ownership:** Each app UI phase owns its own illusion budget. Final v1.3 verification owns cross-app screenshots and launcher-path regression.

**Confidence:** MEDIUM-HIGH.

### Pitfall 9: Verification remains v1.2-shaped while v1.3 adds a state matrix

**What goes wrong:** `verify:v1.2` continues to pass, but v1.3 stateful regressions are untested.

**Why it happens:** v1.2 had a strong canonical gate, but it was built for search/folders, direct URL entry, submissions validation, build/typecheck, and launcher-path coverage. v1.3 needs migration, return-home, reload, cross-launcher, and failure-mode coverage.

**Consequences:**

- Notes migration bugs ship despite unit tests.
- Browser tabs work only before reload or only from one launcher.
- App-state polish is verified by manual feel, not repeatable checks.
- Submitted metadata generation drifts after the first implementation.

**Prevention:**

- Create `bun run verify:v1.3` early, not at milestone closeout.
- Include:
  - `bun run submissions:check`
  - full Vitest
  - explicit typecheck
  - production build
  - WebKit iPhone E2E for Notes rich structure/migration, Browser tabs/session from both launchers, app-state resume, Library metadata workflow, and integrated return-home paths
- Add targeted unit tests for parsers/migrations/state reducers before UI tests.
- Preserve old v1.2 launcher-path tests and extend them rather than replacing them.

**Detection:**

- Verification file still references only `verify:v1.2`.
- E2E does not call `returnHome`, reopen, and reload for v1.3 state.
- New storage code has no malformed/legacy payload tests.

**Suggested phase ownership:** A quality/verification phase should own the aggregate command. Every feature phase should add its own targeted tests before final integration.

**Confidence:** HIGH.

### Pitfall 10: v1.3 scope leaks into sync, arbitrary install, or full browser claims

**What goes wrong:** Rich Notes turns into accounts/sync; Browser tabs turn into full Safari parity; submission workflow turns into install or marketplace behavior.

**Why it happens:** These are natural next ideas once local state, tabs, and reviewed metadata exist. The project document explicitly keeps backend-heavy notes sync, full Safari-parity claims, and arbitrary app install flows out of scope.

**Consequences:**

- Roadmap phases become too broad to verify.
- Truthfulness constraints weaken.
- Platform metadata is forced to answer trust/install/account questions before the repo-driven path matures.

**Prevention:**

- Give every v1.3 phase an explicit "Not in this phase" list.
- Define UAT in terms of local-only state, truthful fallback, reviewed metadata, and return-to-context behavior.
- Use backlog entries for sync/accounts, arbitrary install, permissions, moderation, and Safari-parity browsing.
- Reject any copy that says or implies cloud recovery, remote page compatibility, marketplace install, or arbitrary app launch.

**Detection:**

- Requirements mention account, sync, install, permissions, marketplace, or full browser.
- New UI includes "Install", "Open app", "Sign in", "Sync", or similar controls for unimplemented capabilities.
- Tests require network/backend behavior beyond existing external links and same-origin fixtures.

**Suggested phase ownership:** Roadmap/requirements generation owns this upfront. Each feature phase owns its own anti-scope checks.

**Confidence:** HIGH.

## Moderate Pitfalls

### Pitfall 11: Rich content search and previews drift from stored content

**What goes wrong:** Notes search still reads `body` while the editor writes blocks/checklists/formatting elsewhere.

**Prevention:** Keep one pure projection from stored note content to searchable text and preview text. Unit test it separately from React.

**Suggested phase ownership:** Notes storage/model phase.

### Pitfall 12: Tab IDs collide with destination IDs

**What goes wrong:** Browser currently derives direct destination IDs by sanitizing URLs. A tab system that uses destination IDs as tab IDs can collide or replace distinct sessions.

**Prevention:** Use opaque tab IDs and store destination separately. Keep URL normalization for destination matching, not tab identity.

**Suggested phase ownership:** Browser tabs/session phase.

### Pitfall 13: Autosave becomes noisy or lossy

**What goes wrong:** Persisting every keystroke creates heavy writes; debouncing too aggressively loses edits on app close/reload.

**Prevention:** Define app-specific save semantics. Notes should persist content promptly with visible failure states; Browser tab/session writes can be event-based on tab create/select/navigate/close.

**Suggested phase ownership:** Notes editor UI phase and Browser tabs/session phase.

### Pitfall 14: Corrupt timestamps break restored UI

**What goes wrong:** Current Notes formatting calls `new Date(timestamp)` and formats it. Rich migration or malformed state can introduce invalid dates.

**Prevention:** Parse timestamps at storage boundaries, replace invalid values with safe defaults, and unit test malformed timestamps.

**Suggested phase ownership:** Notes storage/model phase and app-state foundation phase.

### Pitfall 15: Catalog and submission tests stay composed, not end-to-end

**What goes wrong:** The CLI proves validation and browser specs prove catalog browsing, but no scenario proves a new reviewed manifest reaches the Library through the safer workflow.

**Prevention:** Add a generation/check fixture or focused test that exercises the submission-to-catalog path after the workflow change.

**Suggested phase ownership:** Submitted metadata workflow phase.

## Minor Pitfalls

### Pitfall 16: Copy grows into in-app documentation

**What goes wrong:** New state features add explanatory paragraphs to every app surface, crowding the shell.

**Prevention:** Keep truthfulness copy short and contextual. Move contributor workflow detail to docs, not product UI.

**Suggested phase ownership:** Each app UI phase.

### Pitfall 17: New scripts bypass the Bun/TypeScript tooling surface

**What goes wrong:** Metadata workflow adds Python or shell-heavy logic despite the repo being Bun/TypeScript friendly.

**Prevention:** Use Bun-run TypeScript/JavaScript for repo-owned generation and validation scripts unless a concrete exception is documented.

**Suggested phase ownership:** Submitted metadata workflow phase.

### Pitfall 18: Test IDs encode mutable labels

**What goes wrong:** Notes folder chips and catalog categories derive test IDs from labels. Richer organization can make tests brittle around renames or duplicate-looking labels.

**Prevention:** Prefer stable IDs for user-created state where possible. Keep label-derived IDs only for fixed fixtures.

**Suggested phase ownership:** Notes structure phase and final E2E cleanup.

## Phase-Specific Warnings

| Suggested phase topic | Likely pitfall | Roadmap mitigation |
| --- | --- | --- |
| Notes storage/model foundation | Rich editor writes data the existing model cannot safely parse, migrate, search, or preview | Start with v3 snapshot, migrations, projection helpers, and storage-failure tests before UI |
| Notes rich editor UI | Mobile editing becomes desktop-like or loses data during typing | Limit formatting scope, use mobile-native controls, verify keyboard/reload/return-home paths |
| Core app-state foundation | Resume behavior is implemented ad hoc in each app | Add shared app-state storage/parsing helpers and define durable vs resumable state |
| Browser tabs/session | Tabs split by grid/dock launcher or imply remote pages are embedded | Key by canonical Browser namespace and store per-tab render mode/source |
| Submitted metadata workflow | Safer workflow creates another hand-maintained registry | Choose generated registry or scaffolded manual registry, then make `submissions:check` fail stale output |
| Library/submission UX | Browse-only metadata drifts into install or marketplace claims | Keep Library copy review/browse-only and validator-enforced review states |
| v1.3 verification gate | Existing `verify:v1.2` misses stateful regressions | Create `verify:v1.3` early with migration, return-home, reload, cross-launcher, and workflow coverage |
| Final integration polish | Individual features pass but strict iPhone illusion regresses | Run WebKit iPhone launcher-path tests plus screenshot review for dense stateful states |

## Roadmap Prevention Strategy

Recommended ordering:

1. **State contracts before UI:** Notes v3 model/migration and shared app-state helpers should land before rich Notes controls or Browser tab chrome.
2. **Browser identity before tab UX:** Confirm canonical Browser namespace usage, then add tabs/session restore across both Browser launchers.
3. **Workflow source-of-truth before catalog polish:** Mature submitted metadata generation/scaffolding before adding new Library affordances.
4. **Per-feature verification before aggregate gate:** Every phase adds targeted model/parser tests and launcher-path proof. The final phase consolidates into `bun run verify:v1.3`.
5. **Scope checks at every phase:** Explicitly keep sync/accounts, arbitrary install, and full Safari parity out of v1.3.

## Sources

Project sources:

- `.planning/PROJECT.md` - v1.3 active goals, out-of-scope constraints, truthfulness decisions
- `.planning/RETROSPECTIVE.md` - v1.2 lessons around canonical metadata and verification
- `.planning/milestones/v1.2-MILESTONE-AUDIT.md` - remaining tech debt around manual submitted-manifest workflow and Browser dual launcher identity
- `.planning/milestones/v1.2-phases/21-submitted-manifest-discovery-hardening/21-VERIFICATION.md` - fail-closed submitted manifest drift behavior
- `.planning/milestones/v1.2-phases/22-browser-launcher-identity-cleanup/22-VERIFICATION.md` - shared Browser namespace and dual-launcher coverage
- Current source/tests listed in "Research Basis"

External authoritative sources:

- MDN, `Window.localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN, storage quotas and eviction criteria: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN, `X-Frame-Options`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options
- MDN, CSP `frame-ancestors`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- MDN, `contenteditable`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable
- React, preserving and resetting state: https://react.dev/learn/preserving-and-resetting-state
- Bright Builds standards loaded from `AGENTS.bright-builds.md` and canonical standards pages.
