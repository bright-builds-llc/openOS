---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 23-2026-05-27T21-23-33
generated_at: 2026-05-27T21:24:49.904Z
---

# Phase 23: State Contracts And Verification Baseline - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Phase 23 defines and proves the shared local app-session state contract for `v1.3`. It should make disposable app UI state safe, versioned, recoverable, and visibly truthful when storage fails, without implementing Notes rich editing, Browser tabs, submitted-app workflow generation, or broad cross-app resume UI. Those feature surfaces belong to Phases 24-28.

</domain>

<decisions>
## Implementation Decisions

### Storage Contract

- **D-01:** App-session snapshots use canonical app storage namespaces with a `.session` key suffix, for example `openos.apps.notes.session`, `openos.apps.browser.session`, `openos.apps.library.session`, and `openos.apps.calculator.session`.
- **D-02:** Durable user-authored or reviewed data stays on existing durable keys such as `openos.apps.notes.notes`; Phase 23 must not delete durable app data when session state is malformed or reset.
- **D-03:** Session state is explicitly disposable UI context. It can be reset safely, but durable data and catalog metadata must remain intact.

### Snapshot Shape And Parsing

- **D-04:** Each app-session snapshot is versioned and app-owned. The shared helper should provide parsing, writing, reset, and unavailable-state primitives without owning app-specific payload schemas.
- **D-05:** Malformed JSON, unknown versions, or invalid app-specific payloads reset the session snapshot to a caller-provided default and report a reset/unavailable status instead of throwing into the app shell.
- **D-06:** Write failures, including storage quota or blocked persistence, must be surfaced as a truthful status that apps can render. The helper should not silently swallow write failures as if persistence succeeded.

### Architecture Boundary

- **D-07:** Keep `HomeScreenRuntimeState` thin. It remains responsible for launcher, origin page, and motion state; it must not accumulate Notes selection, Browser tabs, Calculator display, or Library filters.
- **D-08:** Preserve the functional-core / imperative-shell split: pure session model helpers handle parsing and status decisions; storage adapters own `localStorage` calls; React app shells own rendering and effects.
- **D-09:** Avoid adding a new global state manager or runtime dependency. The current React/Vite/TypeScript/Bun/Vitest/Playwright stack is enough.

### Verification Baseline

- **D-10:** Phase 23 creates the `verify:v1.3` skeleton early and includes the state-contract unit tests needed by later phases.
- **D-11:** Initial verification should prove durable Notes data remains untouched when a session key is reset, malformed session data falls back safely, and write failures can be reported truthfully.
- **D-12:** Browser grid/dock canonical namespace behavior from Phase 22 remains locked; future Browser session keys must use `openos.apps.browser.session`.

### the agent's Discretion

- The exact TypeScript type names, helper module split, status enum labels, and test fixture shape are left to the agent, provided the public behavior above is preserved and remains easy for later app-specific phases to consume.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` — Phase 23 boundary, dependencies, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` — `STATE-02`, `STATE-03`, and `STATE-04` requirements mapped to Phase 23.
- `.planning/research/SUMMARY.md` — v1.3 state-contract research synthesis and roadmap guidance.
- `.planning/PROJECT.md` — project constraints, current milestone goal, and out-of-scope boundaries.

### Existing Platform And App Storage

- `src/features/platform/appStorage.ts` — current namespace/key helpers and app storage metadata contract.
- `src/features/platform/appDefinitions.ts` — canonical storage namespace assignments, including Browser grid/dock aliasing.
- `src/features/runtime/appRegistry.ts` — canonical runtime app selectors and storage namespace lookups.
- `src/features/apps/notes/notesStorage.ts` — existing durable Notes storage parser/write pattern and legacy migration behavior.
- `src/features/apps/browser/BrowserApp.tsx` — current in-memory Browser direct-navigation state that later phases will move onto the session contract.
- `src/features/apps/catalog/AppCatalogApp.tsx` — current in-memory Library selection state that Phase 28 may resume.
- `src/features/apps/calculator/calculatorState.ts` — pure Calculator state model that Phase 28 may snapshot.

### Verification

- `scripts/verify-v1.2.sh` — current milestone aggregate verification pattern to mirror for `verify:v1.3`.
- `package.json` — current script surface and Bun-managed package commands.
- `src/features/platform/appStorage.test.ts` — existing namespace tests that should grow with session-key expectations.
- `src/features/apps/notes/notesStorage.test.ts` — existing durable Notes storage tests that should guard against session resets deleting durable notes.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `createAppStorageNamespace` and `createAppStorageKey` already define stable `openos.apps.<id>` namespaces and dotted keys.
- `getCanonicalRuntimeAppStorageNamespace` can resolve canonical app namespaces by launch surface for later app-specific session usage.
- Notes storage already uses pure parser/normalizer helpers around a thin `StorageLike` adapter, which is the right pattern for reusable session parsing.
- Calculator state is already a pure data model, so later snapshot support can build from plain objects rather than component internals.

### Established Patterns

- App data uses localStorage through explicit feature-owned storage modules, not component-level ad hoc keys.
- Tests use Vitest with `// Arrange`, `// Act`, and `// Assert` sections for non-trivial unit behavior.
- Browser truthfulness depends on distinguishing embedded destinations from Safari fallback destinations and should not be weakened by future session restore.
- Submitted and Library surfaces remain metadata-only; install/run behavior is explicitly deferred.

### Integration Points

- Add the shared session contract near platform storage code, most likely under `src/features/platform/`.
- Extend storage tests to prove canonical `.session` keys and reset/write-failure status behavior.
- Add focused durable-data isolation coverage using Notes' existing durable `openos.apps.notes.notes` key.
- Add `scripts/verify-v1.3.sh` and `package.json` `verify:v1.3` so later phases can expand the same command.

</code_context>

<specifics>
## Specific Ideas

- Treat Phase 23 as a state-contract foundation rather than a visible feature expansion.
- Model "session reset" as truthful app UI context loss, not as data deletion.
- Prefer small app-owned adapters over a generic global state store.

</specifics>

<deferred>
## Deferred Ideas

- Notes v3 document migration and rich editing belong to Phases 24-25.
- Browser tabs, recently closed tabs, and per-tab fallback state belong to Phase 26.
- Submitted-app registry generation and contributor preview output belong to Phase 27.
- Library and Calculator visible resume behavior belongs to Phase 28.

</deferred>

---

*Phase: 23-state-contracts-and-verification-baseline*
*Context gathered: 2026-05-27*
