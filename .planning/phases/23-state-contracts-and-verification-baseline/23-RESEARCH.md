# Phase 23: State Contracts And Verification Baseline - Research

**Researched:** 2026-05-27 [VERIFIED: `date +%F`]
**Domain:** TypeScript/React local app-session storage contracts for openOS v1.3 [VERIFIED: `.planning/ROADMAP.md`, `.planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md`]
**Confidence:** HIGH [VERIFIED: repo code inspection, npm registry checks, MDN docs, Bright Builds standards]

<user_constraints>
## User Constraints (from CONTEXT.md)

The following locked decisions, discretion areas, and deferred items are copied from `23-CONTEXT.md` as the source of truth for planning. [VERIFIED: `.planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md`]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

- Notes v3 document migration and rich editing belong to Phases 24-25.
- Browser tabs, recently closed tabs, and per-tab fallback state belong to Phase 26.
- Submitted-app registry generation and contributor preview output belong to Phase 27.
- Library and Calculator visible resume behavior belongs to Phase 28.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STATE-02 | User-authored durable data remains separate from disposable app-session state. [VERIFIED: `.planning/REQUIREMENTS.md`] | Use `createAppStorageKey(namespace, "session")` for app-session state and keep durable Notes on `openos.apps.notes.notes`; add tests proving session reset never touches durable keys. [VERIFIED: `src/features/platform/appStorage.ts`, `src/features/apps/notes/notesStorage.ts`, `23-CONTEXT.md`] |
| STATE-03 | User can recover from malformed saved app-session state without losing notes or reviewed catalog data. [VERIFIED: `.planning/REQUIREMENTS.md`] | Parse session snapshots through typed result helpers that default/reset malformed JSON, unknown versions, and invalid payloads while leaving durable app data and platform catalog metadata untouched. [VERIFIED: `23-CONTEXT.md`; CITED: MDN `JSON.parse()`] |
| STATE-04 | User sees truthful unavailable or reset behavior when local storage cannot preserve app-session state. [VERIFIED: `.planning/REQUIREMENTS.md`] | Model storage access, parse reset, and write failure as explicit statuses because `localStorage` access can throw `SecurityError` and `Storage.setItem()` can throw `QuotaExceededError`. [CITED: MDN `Window.localStorage`; CITED: MDN `Storage.setItem()`] |
</phase_requirements>

## Summary

Phase 23 should add a narrow platform-owned session storage contract plus tests, not visible app resume features. [VERIFIED: `23-CONTEXT.md` D-04, D-07, D-10; `.planning/ROADMAP.md`] The contract should use canonical app namespaces with a `.session` suffix, keep app payload schemas app-owned, and return typed statuses for valid, initialized, reset, and unavailable states. [VERIFIED: `23-CONTEXT.md`; VERIFIED: `src/features/platform/appStorage.ts`]

The immediate implementation surface is small: extend platform storage helpers, add a shared session helper, add focused unit tests including throwing storage mocks, add durable Notes isolation tests, and introduce `scripts/verify-v1.3.sh` plus `package.json` wiring. [VERIFIED: `src/features/platform/appStorage.test.ts`, `src/features/apps/notes/notesStorage.test.ts`, `scripts/verify-v1.2.sh`, `package.json`] The planner should avoid rich Notes migration, Browser tabs, submitted-app registry generation, and visible Library/Calculator resume behavior in this phase. [VERIFIED: `23-CONTEXT.md` Deferred Ideas]

**Primary recommendation:** Build `src/features/platform/appSessionStorage.ts` as a small functional-core helper with `StorageLike` shell adapters, then prove it with Vitest and wire `bun run verify:v1.3`. [VERIFIED: Bright Builds architecture standards; VERIFIED: current repo test and script patterns]

## Project Constraints (from AGENTS.md)

- Planning and implementation must read `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` when present, and relevant canonical Bright Builds standards before work. [VERIFIED: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`; CITED: Bright Builds standards index]
- Bright Builds requires functional core / imperative shell as the default architecture for business logic. [CITED: Bright Builds `standards/core/architecture.md`]
- Bright Builds requires parsing boundary data into domain types and preferring illegal-state modeling with types. [CITED: Bright Builds `standards/core/architecture.md`]
- Bright Builds TypeScript guidance prefers data-in/data-out business logic, tagged unions/parsers for invariants, and `maybe...` names for nullish internal values. [CITED: Bright Builds `standards/languages/typescript-javascript.md`]
- Repo TypeScript work should use Bun because `package.json` declares `packageManager: "bun@1.3.9"` and `bun.lock` is present. [VERIFIED: `package.json`, `bun.lock`; CITED: Bright Builds TypeScript guidance]
- New repo-owned automation should be TypeScript/JavaScript run by Bun, not Python, because this is a Bun-friendly TS repository. [CITED: Bright Builds `standards/languages/typescript-javascript.md`; VERIFIED: `package.json`]
- Unit tests should be focused and use Arrange, Act, Assert comments unless trivial. [VERIFIED: `AGENTS.md`; VERIFIED: existing Vitest tests]
- Before committing, run relevant repo-native verification and do not commit if checks fail. [VERIFIED: `AGENTS.md`; CITED: Bright Builds `standards/core/verification.md`]
- No project-local `.claude/skills/` or `.agents/skills/` skill files were found. [VERIFIED: `rg --files -g SKILL.md .claude .agents`]
- The repo does not vendor the canonical `standards/` directory; canonical standards were read from the pinned Bright Builds GitHub URLs in `AGENTS.bright-builds.md`. [VERIFIED: `find . -path '*standards*'`; CITED: Bright Builds GitHub raw pages]

## Standard Stack

### Core

| Library | Installed Version | Registry Version / Publish Time | Purpose | Why Standard |
|---------|-------------------|----------------------------------|---------|--------------|
| React / React DOM | `19.2.5` installed for both packages. [VERIFIED: `bun pm ls --depth 0`, `bun.lock`] | `19.2.6`, modified 2026-05-27. [VERIFIED: npm registry] | Existing UI runtime. [VERIFIED: `package.json`] | Keep existing React stack; no Phase 23 requirement needs a new UI runtime or global state dependency. [VERIFIED: `23-CONTEXT.md` D-09] |
| TypeScript | `6.0.2` installed. [VERIFIED: `bun pm ls --depth 0`, `bun x tsc --version`] | `6.0.3`, modified 2026-04-16. [VERIFIED: npm registry] | Strict type modeling and build checks. [VERIFIED: `tsconfig.json`, `package.json`] | Use discriminated unions for status results and parser boundaries. [CITED: Bright Builds TypeScript guidance] |
| Vite | `8.0.8` installed. [VERIFIED: `bun pm ls --depth 0`, `bun x vite --version`] | `8.0.14`, modified 2026-05-21. [VERIFIED: npm registry] | App build and preview server. [VERIFIED: `package.json`, `playwright.config.ts`] | Keep the existing Vite build path; Phase 23 is storage-contract work. [VERIFIED: `.planning/research/STACK.md`] |
| Bun | `1.3.9` local and declared. [VERIFIED: `bun --version`, `package.json`] | Not checked via npm because Bun is the package manager/runtime, not an npm dependency in this repo. [VERIFIED: `package.json`] | Package manager and script runner. [VERIFIED: `package.json`] | Use Bun for `verify:v1.3` wiring and any repo-owned scripts. [CITED: Bright Builds TypeScript guidance; VERIFIED: `scripts/verify-v1.2.sh`] |
| Vitest | `4.1.4` installed. [VERIFIED: `bun pm ls --depth 0`, `bun run test -- --help`] | `4.1.7`, modified 2026-05-20. [VERIFIED: npm registry] | Unit tests for pure state and storage helpers. [VERIFIED: `vite.config.ts`, existing `*.test.ts`] | The current test suite already covers platform/storage helpers with Vitest. [VERIFIED: `src/features/platform/appStorage.test.ts`, `src/features/apps/notes/notesStorage.test.ts`] |
| Playwright | `@playwright/test` `1.59.1` installed. [VERIFIED: `bun pm ls --depth 0`, `bun run test:e2e -- --version`] | `1.60.0`, modified 2026-05-27. [VERIFIED: npm registry] | WebKit iPhone launcher-path regression. [VERIFIED: `playwright.config.ts`] | Keep for aggregate verification; Phase 23 can rely primarily on unit tests and inherit existing E2E coverage. [VERIFIED: `scripts/verify-v1.2.sh`, `23-CONTEXT.md` D-10] |

### Supporting

| Library / API | Version | Purpose | When to Use |
|---------------|---------|---------|-------------|
| Web Storage `localStorage` | Browser API, widely available since July 2015 per MDN. [CITED: MDN `Window.localStorage`] | Store small durable and session snapshots by origin. [CITED: MDN `Window.localStorage`; VERIFIED: current Notes storage] | Use for small app-session snapshots and existing durable Notes data; keep snapshots bounded. [VERIFIED: `.planning/research/STACK.md`] |
| `JSON.parse` / `JSON.stringify` | ECMAScript JSON APIs. [CITED: MDN `JSON.parse()`; CITED: MDN `Storage.setItem()`] | Serialize storage strings and parse unknown snapshots. [CITED: MDN `Storage.setItem()`] | Use only at storage boundaries; catch malformed JSON and convert to typed reset status. [VERIFIED: `23-CONTEXT.md` D-05; CITED: MDN `JSON.parse()`] |
| `createAppStorageNamespace` / `createAppStorageKey` | Internal platform helpers. [VERIFIED: `src/features/platform/appStorage.ts`] | Produce `openos.apps.<id>` namespaces and dotted keys. [VERIFIED: `src/features/platform/appStorage.ts`] | Use for all session keys via `createAppStorageKey(namespace, "session")`. [VERIFIED: `23-CONTEXT.md` D-01] |
| `getCanonicalRuntimeAppStorageNamespace` | Internal runtime selector. [VERIFIED: `src/features/runtime/appRegistry.ts`] | Resolve canonical namespaces by launch surface. [VERIFIED: `src/features/runtime/appRegistry.ts`, `appRegistry.test.ts`] | Use later app-specific phases to keep Browser grid and dock on `openos.apps.browser`. [VERIFIED: `23-CONTEXT.md` D-12] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Shared session helper plus app-owned parsers | Redux, Zustand, Jotai, or XState | Rejected for Phase 23 because the locked decision says no new global state manager or runtime dependency. [VERIFIED: `23-CONTEXT.md` D-09] |
| `localStorage` small snapshots | IndexedDB | Rejected for Phase 23 because the milestone excludes attachments/sync/large datasets and existing research says Web Storage is sufficient for capped snapshots. [VERIFIED: `.planning/research/STACK.md`; CITED: MDN `Window.localStorage`] |
| App-owned payload parser functions | Zod or Ajv | Rejected for Phase 23 because no new runtime dependency is allowed and payload shapes are app-owned by locked decision. [VERIFIED: `23-CONTEXT.md` D-04, D-09] |
| Session-key reset only | `localStorage.clear()` | Rejected because durable Notes and catalog data must remain intact when session state resets. [VERIFIED: `23-CONTEXT.md` D-02, D-03; CITED: MDN `Window.localStorage`] |

**Installation:**

```bash
# No new packages are recommended for Phase 23. [VERIFIED: 23-CONTEXT.md D-09, package.json]
```

**Version verification:** Package versions were checked with `npm view <package> version time.modified` on 2026-05-27. [VERIFIED: npm registry]

## Recommended Files And Plan Boundaries

### Files To Add

| File | Purpose | Boundary |
|------|---------|----------|
| `src/features/platform/appSessionStorage.ts` | Shared session-key, parse, read, write, reset, and status primitives. [VERIFIED: `23-CONTEXT.md` D-04] | Must not contain Notes, Browser, Library, or Calculator payload schemas. [VERIFIED: `23-CONTEXT.md` D-04] |
| `src/features/platform/appSessionStorage.test.ts` | Vitest coverage for missing, malformed, unknown-version, invalid-payload, get failure, write failure, reset, and key construction. [VERIFIED: `23-CONTEXT.md` D-05, D-06, D-10, D-11] | Use throwing storage mocks; do not depend on React. [CITED: Bright Builds architecture/testing standards] |
| `scripts/verify-v1.3.sh` | Milestone command skeleton modeled after `verify-v1.2`. [VERIFIED: `scripts/verify-v1.2.sh`, `23-CONTEXT.md` D-10] | Keep breadcrumb output and `set -euo pipefail`. [VERIFIED: `scripts/verify-v1.2.sh`; VERIFIED: `AGENTS.md`] |

### Files To Modify

| File | Modification | Boundary |
|------|--------------|----------|
| `src/features/platform/appStorage.ts` | Add a narrow `createAppSessionStorageKey(namespace)` wrapper only if it improves readability over repeated `createAppStorageKey(namespace, "session")`. [VERIFIED: `src/features/platform/appStorage.ts`; VERIFIED: `23-CONTEXT.md` D-01] | Do not replace existing namespace/key helpers. [VERIFIED: current app storage tests] |
| `src/features/platform/appStorage.test.ts` | Add canonical `.session` key expectations for Notes, Browser, Library, and Calculator. [VERIFIED: `23-CONTEXT.md` D-01, D-12] | Keep Browser grid/dock namespace assertions intact. [VERIFIED: `appDefinitions.test.ts`, `appRegistry.test.ts`] |
| `src/features/apps/notes/notesStorage.test.ts` | Add durable-data isolation coverage proving `openos.apps.notes.notes` remains untouched when `openos.apps.notes.session` is malformed/reset. [VERIFIED: `23-CONTEXT.md` D-02, D-11] | Do not migrate Notes to v3 in this phase. [VERIFIED: `23-CONTEXT.md` Deferred Ideas] |
| `package.json` | Add `verify:v1.3` script pointing at `bash scripts/verify-v1.3.sh`. [VERIFIED: `package.json`, `scripts/verify-v1.2.sh`] | Do not remove `verify:v1.2`. [VERIFIED: current milestone history] |

### Explicitly Out Of Scope

- Notes v3 document migration, rich editing controls, and Notes resume UI are out of scope for Phase 23. [VERIFIED: `23-CONTEXT.md` Deferred Ideas]
- Browser tabs, recently closed tabs, and per-tab fallback state are out of scope for Phase 23. [VERIFIED: `23-CONTEXT.md` Deferred Ideas]
- Submitted-app registry generation and contributor preview output are out of scope for Phase 23. [VERIFIED: `23-CONTEXT.md` Deferred Ideas]
- Library and Calculator visible resume behavior are out of scope for Phase 23. [VERIFIED: `23-CONTEXT.md` Deferred Ideas]
- `HomeScreenRuntimeState` should remain limited to launcher/navigation/motion state. [VERIFIED: `23-CONTEXT.md` D-07; VERIFIED: `src/features/runtime/homeScreenRuntime.ts`]

## Architecture Patterns

### Recommended Project Structure

```text
src/features/platform/
├── appStorage.ts              # Existing namespace/key helpers. [VERIFIED: repo]
├── appStorage.test.ts         # Existing tests plus canonical session-key expectations. [VERIFIED: repo]
├── appSessionStorage.ts       # New shared app-session contract helper. [RECOMMENDED: 23-CONTEXT.md]
└── appSessionStorage.test.ts  # New pure storage contract tests. [RECOMMENDED: 23-CONTEXT.md]

src/features/apps/notes/
└── notesStorage.test.ts       # Add durable/session isolation regression. [RECOMMENDED: 23-CONTEXT.md]

scripts/
└── verify-v1.3.sh             # New milestone verification skeleton. [RECOMMENDED: scripts/verify-v1.2.sh]
```

### Pattern 1: Typed Session Results

**What:** Model session reads and writes as discriminated unions so apps can distinguish valid state, first-run defaults, reset-after-corruption, and unavailable persistence. [VERIFIED: `23-CONTEXT.md` D-05, D-06; CITED: Bright Builds TypeScript guidance]

**When to use:** Use for every app-session snapshot read/write, including future Notes, Browser, Library, and Calculator adapters. [VERIFIED: `23-CONTEXT.md` D-01, D-04]

**Example:**

```typescript
// Source: 23-CONTEXT.md D-04..D-06 and Bright Builds typed-state guidance.
export type AppSessionReadResult<TSession> =
  | { status: "loaded"; session: TSession }
  | { status: "initialized"; session: TSession }
  | {
      status: "reset";
      session: TSession;
      reason: "malformed-json" | "unsupported-version" | "invalid-payload";
    }
  | {
      status: "unavailable";
      session: TSession;
      reason: "storage-read-failed";
      error: unknown;
    };

export type AppSessionWriteResult =
  | { status: "saved" }
  | {
      status: "unavailable";
      reason: "storage-write-failed";
      error: unknown;
    };
```

### Pattern 2: Functional Core, Imperative Storage Shell

**What:** Put JSON parsing, version checks, and payload parser decisions in pure functions; keep `storage.getItem`, `storage.setItem`, and `storage.removeItem` in thin adapters. [CITED: Bright Builds `standards/core/architecture.md`; VERIFIED: `23-CONTEXT.md` D-08]

**When to use:** Use when adding `appSessionStorage.ts`; later app phases should pass app-owned payload parsers into the shared helper. [VERIFIED: `23-CONTEXT.md` D-04]

**Example:**

```typescript
// Source: current Notes StorageLike pattern plus 23-CONTEXT.md D-04.
type AppSessionStorageLike = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

export function createAppSessionStorageKey(namespace: string): string {
  return createAppStorageKey(namespace, "session");
}
```

### Pattern 3: App-Owned Payload Parser

**What:** The platform helper should validate the envelope and delegate payload validation to an app parser. [VERIFIED: `23-CONTEXT.md` D-04]

**When to use:** Use for future app sessions so the platform helper stays generic and app modules retain domain ownership. [VERIFIED: `23-CONTEXT.md` D-04, D-07]

**Example:**

```typescript
// Source: recommended synthesis from 23-CONTEXT.md D-04 and Bright Builds parse-boundary guidance.
type AppSessionEnvelope<TVersion extends number> = {
  version: TVersion;
  payload: unknown;
};

type AppSessionPayloadParser<TSession> = (
  maybePayload: unknown,
) => TSession | null;
```

### Anti-Patterns to Avoid

- **Centralized cross-app payload schema:** This contradicts the locked decision that snapshots are app-owned. [VERIFIED: `23-CONTEXT.md` D-04]
- **Throwing storage errors into React app shells:** This contradicts the locked decision to surface reset/unavailable status truthfully. [VERIFIED: `23-CONTEXT.md` D-05, D-06]
- **Deleting durable keys during session reset:** This contradicts STATE-02 and Phase 23 success criterion 1. [VERIFIED: `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`]
- **Adding app-specific state to `HomeScreenRuntimeState`:** This contradicts the locked runtime boundary and the current runtime model shape. [VERIFIED: `23-CONTEXT.md` D-07; VERIFIED: `src/features/runtime/homeScreenRuntime.ts`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| App-session key naming | Ad hoc strings like `"notesSession"` or launcher-specific Browser keys. [VERIFIED: Phase 22 context in `23-CONTEXT.md`] | `createAppStorageKey(namespace, "session")` or a wrapper that calls it. [VERIFIED: `appStorage.ts`, `23-CONTEXT.md` D-01] | Canonical namespaces already preserve Browser grid/dock identity. [VERIFIED: `appDefinitions.test.ts`, `appRegistry.test.ts`] |
| Cross-app state management | Redux/Zustand/Jotai/XState or a custom global store. [VERIFIED: `23-CONTEXT.md` D-09] | Per-app session snapshots plus React local state. [VERIFIED: `.planning/research/STACK.md`] | The shell opens one app surface at a time and app context belongs with each app. [VERIFIED: `homeScreenRuntime.ts`, `.planning/research/ARCHITECTURE.md`] |
| Storage failure handling | Repeated `try/catch` blocks inside app components. [VERIFIED: current components call storage directly in `NotesApp.tsx`] | Shared `appSessionStorage.ts` typed results. [VERIFIED: `23-CONTEXT.md` D-06] | MDN documents storage access and write exceptions that need consistent user-visible status. [CITED: MDN `Window.localStorage`; CITED: MDN `Storage.setItem()`] |
| Session reset | `localStorage.clear()` or broad namespace deletion. [VERIFIED: no current session helper exists via `rg`] | Remove or overwrite only the exact `.session` key. [VERIFIED: `23-CONTEXT.md` D-02, D-03] | Durable Notes data and reviewed catalog metadata must survive session reset. [VERIFIED: `.planning/ROADMAP.md`] |
| App payload validation | One generic platform schema for all app sessions. [VERIFIED: `23-CONTEXT.md` D-04] | App-owned parser callbacks returning `TSession | null`. [CITED: Bright Builds parse-boundary guidance] | Later apps can evolve their payloads independently while sharing envelope/status behavior. [VERIFIED: `23-CONTEXT.md` D-04] |

**Key insight:** The complex part is not `localStorage`; it is proving that corrupt or unavailable session state resets only disposable UI context and communicates that truth without touching durable records. [VERIFIED: `23-CONTEXT.md`; CITED: MDN Web Storage docs]

## Common Pitfalls

### Pitfall 1: Session Reset Deletes Durable Data

**What goes wrong:** A reset path clears an entire namespace or all local storage, deleting `openos.apps.notes.notes`. [VERIFIED: `.planning/ROADMAP.md` risk; VERIFIED: current durable Notes key in `notesStorage.ts`]

**Why it happens:** `localStorage.clear()` exists and removes stored items broadly, while Phase 23 only needs to reset one `.session` key. [CITED: MDN `Window.localStorage`; VERIFIED: `23-CONTEXT.md` D-02]

**How to avoid:** Derive a single session key with `createAppStorageKey(namespace, "session")` and use only that key for reset/write tests. [VERIFIED: `appStorage.ts`, `23-CONTEXT.md` D-01]

**Warning signs:** Tests assert only "session becomes default" but do not assert the durable Notes key still exists. [VERIFIED: current `notesStorage.test.ts` has durable tests but no session reset isolation test]

### Pitfall 2: Treating Malformed JSON As An Empty Successful Load

**What goes wrong:** Corrupt session data silently becomes default state with no reset status for the app to render. [VERIFIED: `23-CONTEXT.md` D-05]

**Why it happens:** Existing durable Notes storage catches parse errors and returns an empty snapshot, which is acceptable for current v2 behavior but insufficient for Phase 23 truthfulness. [VERIFIED: `notesStorage.ts` lines 169-205]

**How to avoid:** Return `status: "reset"` with a specific reason for malformed JSON, unsupported version, or invalid payload. [VERIFIED: `23-CONTEXT.md` D-05; CITED: MDN `JSON.parse()`]

**Warning signs:** Unit tests check fallback data but not the status returned to UI code. [VERIFIED: current `notesStorage.test.ts` invalid payload test]

### Pitfall 3: Swallowing Write Failures

**What goes wrong:** The app appears to save session state, but reload loses it because `setItem` failed. [VERIFIED: `23-CONTEXT.md` D-06]

**Why it happens:** `Storage.setItem()` can throw `QuotaExceededError`, and `localStorage` access can throw `SecurityError` when persistence is blocked. [CITED: MDN `Storage.setItem()`; CITED: MDN `Window.localStorage`]

**How to avoid:** `writeAppSessionSnapshot` should return `saved` or `unavailable` and tests should use a `setItem`-throwing storage mock. [VERIFIED: `23-CONTEXT.md` D-06, D-11]

**Warning signs:** New code calls `window.localStorage.setItem` directly from React components. [VERIFIED: current direct storage pattern in `NotesApp.tsx`; VERIFIED: `.planning/research/PITFALLS.md`]

### Pitfall 4: Reintroducing Browser Split Identity

**What goes wrong:** Browser grid and dock launchers get different session keys. [VERIFIED: `23-CONTEXT.md` D-12]

**Why it happens:** The grid app id is `browser-grid`, but both Browser entries intentionally share the `browser` storage namespace. [VERIFIED: `appDefinitions.ts`, `appDefinitions.test.ts`, `appRegistry.test.ts`]

**How to avoid:** Resolve Browser session keys from the canonical storage namespace and assert `openos.apps.browser.session`. [VERIFIED: `23-CONTEXT.md` D-12]

**Warning signs:** A test or implementation constructs `openos.apps.browser-grid.session`. [VERIFIED: `appStorage.ts` naming behavior]

### Pitfall 5: Overbuilding A Framework

**What goes wrong:** Phase 23 becomes a generic state manager or schema framework instead of a small contract baseline. [VERIFIED: `23-CONTEXT.md` D-09]

**Why it happens:** Later phases need app-specific state, but the shared part is only the storage envelope/status behavior. [VERIFIED: `23-CONTEXT.md` D-04; VERIFIED: `.planning/research/SUMMARY.md`]

**How to avoid:** Keep the helper small, keep payload parsing app-owned, and leave visible resume behavior to later phases. [VERIFIED: `23-CONTEXT.md` Deferred Ideas]

**Warning signs:** Platform code imports Notes, Browser, Library, or Calculator session types. [VERIFIED: `23-CONTEXT.md` D-04, D-07]

## Code Examples

Verified patterns from repo sources and official docs:

### Session Key Helper

```typescript
// Source: src/features/platform/appStorage.ts and 23-CONTEXT.md D-01.
export function createAppSessionStorageKey(namespace: string): string {
  return createAppStorageKey(namespace, "session");
}
```

### Durable Isolation Test Shape

```typescript
// Source: current notesStorage.test.ts storage mock plus 23-CONTEXT.md D-11.
it("resets malformed Notes session state without deleting durable notes", () => {
  // Arrange
  const storage = createStorage();
  const namespace = createAppStorageNamespace("notes");
  const durableKey = createAppStorageKey(namespace, "notes");
  const sessionKey = createAppStorageKey(namespace, "session");

  storage.setItem(durableKey, JSON.stringify(validNotesSnapshot));
  storage.setItem(sessionKey, "{bad json");

  // Act
  const result = readAppSessionSnapshot(storage, namespace, {
    version: 1,
    defaultSession: defaultNotesSession,
    maybeParsePayload: maybeParseNotesSessionPayload,
  });

  // Assert
  expect(result.status).toBe("reset");
  expect(storage.getItem(durableKey)).not.toBeNull();
});
```

### Write Failure Test Shape

```typescript
// Source: MDN Storage.setItem() QuotaExceededError docs and 23-CONTEXT.md D-06.
const throwingStorage = {
  getItem: () => null,
  removeItem: () => undefined,
  setItem: () => {
    throw new DOMException("quota", "QuotaExceededError");
  },
} satisfies AppSessionStorageLike;

const result = writeAppSessionSnapshot(throwingStorage, namespace, {
  version: 1,
  payload: {},
});

expect(result).toMatchObject({
  status: "unavailable",
  reason: "storage-write-failed",
});
```

## State Of The Art

| Old Approach | Current Approach | When Changed / Verified | Impact |
|--------------|------------------|--------------------------|--------|
| Component-local `useState` only for app UI context. [VERIFIED: `BrowserApp.tsx`, `AppCatalogApp.tsx`, `NotesApp.tsx`] | Versioned per-app session snapshots for resumable UI context. [VERIFIED: `.planning/research/SUMMARY.md`, `23-CONTEXT.md`] | v1.3 roadmap created 2026-05-27. [VERIFIED: `.planning/ROADMAP.md`] | React discards component state when a component is removed, so app close/reopen needs storage-backed state for later phases. [CITED: React docs] |
| Durable data and UI context can share one storage blob. [VERIFIED: avoided by `23-CONTEXT.md`] | Durable keys and `.session` keys are separate. [VERIFIED: `23-CONTEXT.md` D-01, D-02] | Phase 23 decision recorded 2026-05-27. [VERIFIED: `23-CONTEXT.md`] | Corrupt UI state can reset without deleting authored Notes or catalog metadata. [VERIFIED: `.planning/ROADMAP.md`] |
| Parse failures return defaults without status. [VERIFIED: `notesStorage.ts`] | Parse failures return reset/unavailable status that apps can render. [VERIFIED: `23-CONTEXT.md` D-05] | Phase 23 decision recorded 2026-05-27. [VERIFIED: `23-CONTEXT.md`] | Users can see truthful reset behavior instead of silent state loss. [VERIFIED: `.planning/REQUIREMENTS.md` STATE-04] |
| Previous milestone gate is `verify:v1.2`. [VERIFIED: `package.json`, `scripts/verify-v1.2.sh`] | Add `verify:v1.3` early and let later phases expand it. [VERIFIED: `23-CONTEXT.md` D-10] | Phase 23 starts v1.3 verification baseline. [VERIFIED: `.planning/ROADMAP.md`] | Maintainers get one canonical command path before stateful features expand. [VERIFIED: `.planning/research/PITFALLS.md`] |

**Deprecated/outdated:**

- Using `verify:v1.2` as the only milestone gate is outdated for v1.3 because it lacks explicit app-session reset/write-failure requirements. [VERIFIED: `.planning/research/PITFALLS.md`, `23-CONTEXT.md` D-10, D-11]
- Direct component-level session persistence is outdated for this phase because storage failures must become typed, renderable statuses. [VERIFIED: `23-CONTEXT.md` D-06; CITED: MDN Web Storage docs]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Package scripts and `verify:v1.3`. [VERIFIED: `package.json`] | Yes. [VERIFIED: `command -v bun`] | `1.3.9`. [VERIFIED: `bun --version`] | None needed. [VERIFIED: local environment] |
| Node.js | npm registry checks and Vite tooling. [VERIFIED: local commands] | Yes. [VERIFIED: `command -v node`] | `v24.13.0`. [VERIFIED: `node --version`] | None needed. [VERIFIED: local environment] |
| npm | Version verification via registry. [VERIFIED: research commands] | Yes. [VERIFIED: `command -v npm`] | `11.6.2`. [VERIFIED: `npm --version`] | Use package lock data if registry is unavailable. [VERIFIED: `bun.lock`] |
| Bash | Verification scripts. [VERIFIED: `scripts/verify-v1.2.sh`] | Yes. [VERIFIED: `command -v bash`] | `/bin/bash`. [VERIFIED: local command] | None needed. [VERIFIED: local environment] |
| WebKit Playwright browser | Existing milestone E2E command. [VERIFIED: `playwright.config.ts`, `scripts/verify-v1.2.sh`] | Yes. [VERIFIED: local Playwright cache check] | WebKit 26.4, Playwright build `2272`. [VERIFIED: `bun x playwright install --dry-run webkit`] | Run unit/build checks if E2E infrastructure fails, but the full gate expects WebKit. [VERIFIED: `scripts/verify-v1.2.sh`] |
| Git | Research commit when `commit_docs` is true. [VERIFIED: GSD init output] | Yes. [VERIFIED: `command -v git`] | Available at `/opt/homebrew/bin/git`. [VERIFIED: local command] | None needed. [VERIFIED: local environment] |

**Missing dependencies with no fallback:** None found. [VERIFIED: environment audit commands]

**Missing dependencies with fallback:** None found. [VERIFIED: environment audit commands]

## Validation Architecture

Nyquist validation is disabled for this project run because `.planning/config.json` has no `workflow.nyquist_validation: true` setting. [VERIFIED: `.planning/config.json`]

Phase 23 should still create a repo-owned verification baseline because `23-CONTEXT.md` locks `verify:v1.3` creation and state-contract unit tests. [VERIFIED: `23-CONTEXT.md` D-10, D-11]

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `4.1.4` for unit tests and Playwright `1.59.1` for E2E. [VERIFIED: `bun pm ls --depth 0`] |
| Config file | `vite.config.ts` for Vitest and `playwright.config.ts` for Playwright. [VERIFIED: repo files] |
| Quick run command | `bun run test -- src/features/platform/appStorage.test.ts src/features/platform/appSessionStorage.test.ts src/features/apps/notes/notesStorage.test.ts` [VERIFIED: package script pattern] |
| Full suite command | `bun run verify:v1.3` after the script is added. [VERIFIED: `23-CONTEXT.md` D-10; RECOMMENDED: `scripts/verify-v1.2.sh`] |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| STATE-02 | Durable Notes data stays separate from `.session` reset. [VERIFIED: `.planning/REQUIREMENTS.md`] | Unit. [VERIFIED: `23-CONTEXT.md` D-11] | `bun run test -- src/features/apps/notes/notesStorage.test.ts` [VERIFIED: package script] | Exists, needs new case. [VERIFIED: repo file] |
| STATE-03 | Malformed app-session JSON/versions/payloads reset to defaults without touching durable data. [VERIFIED: `.planning/REQUIREMENTS.md`] | Unit. [VERIFIED: `23-CONTEXT.md` D-05] | `bun run test -- src/features/platform/appSessionStorage.test.ts` [RECOMMENDED: new file] | Missing, create in Phase 23. [VERIFIED: `rg --files`] |
| STATE-04 | Read/write failures return truthful unavailable status. [VERIFIED: `.planning/REQUIREMENTS.md`] | Unit. [VERIFIED: `23-CONTEXT.md` D-06] | `bun run test -- src/features/platform/appSessionStorage.test.ts` [RECOMMENDED: new file] | Missing, create in Phase 23. [VERIFIED: `rg --files`] |

### Verification Commands To Require

- `bun run test -- src/features/platform/appStorage.test.ts src/features/platform/appSessionStorage.test.ts src/features/apps/notes/notesStorage.test.ts` for the focused state-contract loop. [RECOMMENDED: Phase 23 scope]
- `bun x tsc --noEmit` for strict type coverage of new discriminated unions. [VERIFIED: `package.json`, `tsconfig.json`]
- `bun run build` for production bundle integrity. [VERIFIED: `package.json`]
- `bun run verify:v1.3` for closeout once the script is added. [VERIFIED: `23-CONTEXT.md` D-10]

### Wave 0 Gaps

- [ ] `src/features/platform/appSessionStorage.ts` is missing and should be added before later app-specific session adapters. [VERIFIED: `rg --files`]
- [ ] `src/features/platform/appSessionStorage.test.ts` is missing and should cover reset/unavailable status behavior. [VERIFIED: `rg --files`; VERIFIED: `23-CONTEXT.md` D-10, D-11]
- [ ] `scripts/verify-v1.3.sh` and `package.json` `verify:v1.3` are missing. [VERIFIED: `package.json`, `rg verify:v1.3`]

## Security Domain

Security enforcement is enabled by default for this GSD run because `.planning/config.json` does not explicitly set `security_enforcement` to `false`. [VERIFIED: `.planning/config.json`; VERIFIED: GSD researcher instructions]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| Authentication / ASVS V6 | No; Phase 23 has no accounts, credentials, or identity provider work. [VERIFIED: `.planning/REQUIREMENTS.md`; CITED: OWASP ASVS index] | No authentication changes. [VERIFIED: Phase scope] |
| Session Management / ASVS V7 | Not for authenticated sessions; Phase 23 "session" means disposable local app UI context, not a login token. [VERIFIED: `23-CONTEXT.md`; CITED: OWASP ASVS index] | Do not introduce secrets or auth tokens; treat stored app-session payloads as untrusted local input. [CITED: OWASP ASVS index; CITED: Bright Builds parse-boundary guidance] |
| Authorization / ASVS V8 | No backend or protected resource authorization is in scope. [VERIFIED: `.planning/ROADMAP.md`; CITED: OWASP ASVS index] | No access-control logic changes. [VERIFIED: Phase scope] |
| Validation and Business Logic / ASVS V2 | Yes; localStorage strings are boundary input that can be malformed or tampered with. [CITED: OWASP ASVS index; CITED: MDN `localStorage`] | Parse JSON at the storage boundary, validate version and payload, and reset invalid data to defaults. [VERIFIED: `23-CONTEXT.md` D-05; CITED: Bright Builds parse-boundary guidance] |
| Cryptography / ASVS V11 | No; Phase 23 does not store secrets or encrypt local data. [VERIFIED: `.planning/REQUIREMENTS.md`; CITED: OWASP ASVS index] | Do not hand-roll crypto; no crypto is required for disposable local UI snapshots. [VERIFIED: Phase scope] |

### Known Threat Patterns for Local Session Storage

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Tampered localStorage JSON causes app crash. [CITED: MDN `JSON.parse()`] | Tampering / Denial of Service. [CITED: OWASP ASVS index] | Catch parse errors and return reset status with default session. [VERIFIED: `23-CONTEXT.md` D-05] |
| Blocked persistence or quota failure lies to user about saved state. [CITED: MDN `Window.localStorage`; CITED: MDN `Storage.setItem()`] | Denial of Service / Repudiation. [CITED: OWASP ASVS index] | Return `unavailable` write/read status and render truthful unavailable/reset UI in apps. [VERIFIED: `23-CONTEXT.md` D-06] |
| Broad reset deletes durable user data. [VERIFIED: `.planning/ROADMAP.md`] | Tampering / Information Loss. [VERIFIED: Phase success criteria] | Reset only exact `.session` keys and assert durable keys remain. [VERIFIED: `23-CONTEXT.md` D-02, D-11] |
| Future app payloads render stored HTML. [VERIFIED: `.planning/research/STACK.md` avoidance] | Cross-site scripting. [CITED: OWASP ASVS index] | Keep Phase 23 payloads as typed data and render text through React instead of storing/rendering raw HTML. [VERIFIED: `.planning/research/STACK.md`; CITED: React docs] |

## Assumptions Log

All claims in this research were verified from repo files, npm registry output, MDN, React docs, OWASP, or Bright Builds sources during this session. [VERIFIED: sources listed below]

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| None | No `[ASSUMED]` claims were used. [VERIFIED: research drafting audit] | All sections | No user confirmation is required before planning. [VERIFIED: source coverage] |

## Open Questions (RESOLVED)

1. **RESOLVED: Exact status labels and UI copy**
   - What we know: The context leaves exact TypeScript type names and status enum labels to the agent. [VERIFIED: `23-CONTEXT.md` the agent's Discretion]
   - Resolution: Plan 23-01 locks stable typed status semantics for the shared helper now: read statuses `missing`, `loaded`, `reset`, and `unavailable`; write statuses `saved` and `unavailable`; reset statuses `reset` and `unavailable`; reset reasons `malformed-json`, `unsupported-version`, and `invalid-payload`; unavailable reasons `storage-read-failed`, `storage-write-failed`, and `storage-reset-failed`.
   - Resolution: User-facing copy remains deferred to later app-specific UI phases because Phase 23 only creates the platform contract and verification baseline. [VERIFIED: `23-CONTEXT.md` Phase Boundary; VERIFIED: `23-01-PLAN.md`]

2. **RESOLVED: Whether `appStorage.ts` should own `createAppSessionStorageKey`**
   - What we know: `createAppStorageKey(namespace, "session")` already produces the canonical key. [VERIFIED: `src/features/platform/appStorage.ts`, `23-CONTEXT.md` D-01]
   - Resolution: Add and export `createAppSessionStorageKey(namespace: string)` from `src/features/platform/appStorage.ts`; Plan 23-01 requires the exact implementation expression `createAppStorageKey(namespace, "session")`.
   - Resolution: The wrapper is justified because it makes canonical `.session` key expectations grep-verifiable across platform tests, runtime Browser namespace regression, Notes durable-isolation tests, and later app-specific session adapters. [VERIFIED: `23-01-PLAN.md`; VERIFIED: `23-02-PLAN.md`]

## Sources

### Primary (HIGH confidence)

- `.planning/phases/23-state-contracts-and-verification-baseline/23-CONTEXT.md` - locked decisions, phase boundary, canonical refs, verification baseline. [VERIFIED: mandatory read]
- `.planning/REQUIREMENTS.md` - STATE-02, STATE-03, STATE-04 requirement text. [VERIFIED: mandatory read]
- `.planning/ROADMAP.md` - Phase 23 goal, dependencies, success criteria, and out-of-scope phase sequencing. [VERIFIED: mandatory read]
- `.planning/STATE.md` - current milestone status and decisions. [VERIFIED: mandatory read]
- `.planning/research/SUMMARY.md`, `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` - v1.3 research synthesis and state-contract guidance. [VERIFIED: local research files]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo workflow constraints and Bright Builds routing. [VERIFIED: mandatory read plus local standards read]
- Bright Builds pinned standards:
  - `standards/index.md` at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md [CITED]
  - `standards/core/architecture.md`: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md [CITED]
  - `standards/core/code-shape.md`: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md [CITED]
  - `standards/core/verification.md`: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/verification.md [CITED]
  - `standards/core/testing.md`: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md [CITED]
  - `standards/languages/typescript-javascript.md`: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md [CITED]
- Current code:
  - `src/features/platform/appStorage.ts`, `appStorage.test.ts` - namespace/key helpers and tests. [VERIFIED: code read]
  - `src/features/platform/appDefinitions.ts`, `appDefinitions.test.ts` - canonical Browser namespace assignments. [VERIFIED: code read]
  - `src/features/runtime/appRegistry.ts`, `appRegistry.test.ts` - canonical storage namespace selectors. [VERIFIED: code read]
  - `src/features/runtime/homeScreenRuntime.ts` - thin runtime state model. [VERIFIED: code read]
  - `src/features/apps/notes/notesStorage.ts`, `notesStorage.test.ts`, `NotesApp.tsx` - durable Notes storage and current storage patterns. [VERIFIED: code read]
  - `src/features/apps/browser/BrowserApp.tsx`, `browserDestinations.ts`, `browserDestinations.test.ts` - current in-memory Browser state and truthful render modes. [VERIFIED: code read]
  - `src/features/apps/catalog/AppCatalogApp.tsx`, `appCatalogModel.ts` - current in-memory Library selection state. [VERIFIED: code read]
  - `src/features/apps/calculator/calculatorState.ts` - pure Calculator model. [VERIFIED: code read]
  - `scripts/verify-v1.2.sh`, `package.json`, `vite.config.ts`, `playwright.config.ts`, `tsconfig.json`, `bun.lock` - verification and stack surface. [VERIFIED: code read]
- npm registry checks for React, React DOM, types packages, Vite, Vite React plugin, TypeScript, Vitest, and Playwright. [VERIFIED: `npm view ... version time.modified`]
- MDN Web Storage and JSON docs:
  - `Window.localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage [CITED]
  - `Storage.setItem()`: https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem [CITED]
  - `JSON.parse()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse [CITED]
- React docs, "Preserving and Resetting State": https://react.dev/learn/preserving-and-resetting-state [CITED]
- OWASP ASVS index: https://cheatsheetseries.owasp.org/IndexASVS.html [CITED]

### Secondary (MEDIUM confidence)

- OWASP Web Security Testing Guide and Secure Coding Practices search results were used only to cross-check security category relevance. [CITED: OWASP search results]

### Tertiary (LOW confidence)

- None. [VERIFIED: source audit]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - package versions were checked locally and against npm; Phase 23 forbids new dependencies. [VERIFIED: `package.json`, `bun.lock`, npm registry, `23-CONTEXT.md` D-09]
- Architecture: HIGH - locked decisions, Bright Builds standards, and current repo seams all point to a small functional-core storage helper. [VERIFIED: `23-CONTEXT.md`; CITED: Bright Builds architecture standards; VERIFIED: code read]
- Pitfalls: HIGH - risks are directly tied to Phase 23 success criteria and MDN-documented storage failure modes. [VERIFIED: `.planning/ROADMAP.md`; CITED: MDN docs]
- Verification: HIGH - current `verify:v1.2` and package scripts give a clear pattern for `verify:v1.3`. [VERIFIED: `scripts/verify-v1.2.sh`, `package.json`, `23-CONTEXT.md` D-10]

**Research date:** 2026-05-27 [VERIFIED: `date +%F`]
**Valid until:** 2026-06-26 for repo architecture and local storage contract guidance; package latest-version data should be refreshed after 7 days because current packages are actively updating. [VERIFIED: npm registry timestamps; RECOMMENDED: GSD research freshness rule]
