# Research Summary: openOS v1.3 Stateful Apps & Platform Maturity

**Project:** openOS
**Milestone:** v1.3 Stateful Apps & Platform Maturity
**Researched:** 2026-05-27
**Confidence:** HIGH overall

## Executive Summary

openOS v1.3 is a state-contract milestone, not a framework or marketplace milestone. The product is an iPhone-style local web OS shell with built-in apps, truthful Browser constraints, local-first Notes, and a reviewed metadata catalog. The research consistently recommends deepening local app state through typed domain models, versioned storage snapshots, and app-owned session adapters rather than adding broad runtime dependencies.

The right approach is to keep the stack stable and mature the seams already present in the codebase: Notes gets a structured local content model and v3 migration; Browser gets capped tab/session snapshots keyed to the canonical Browser namespace; built-in apps get small app-owned resume contracts; submitted apps get a Bun-owned generated or checked registry so validation and Library stay on one source of truth.

The main risks are data loss, fake statefulness, Browser overclaiming, and submission/catalog drift. Mitigate them by building storage contracts before UI, preserving the Browser embedded-vs-external-fallback boundary per tab, avoiding sync/install/Safari-parity scope, and creating `verify:v1.3` early with migration, reload, return-home, cross-launcher, and generated-registry checks.

## Key Findings

### Stack Additions And Avoidances

No new runtime packages are recommended for v1.3. Keep React 19, Vite 8, TypeScript 6, Bun, Vitest, and Playwright; optional patch updates can happen separately, but they are not feature prerequisites.

Recommended internal additions:

- `notesDocumentModel.ts` plus Notes storage version `3` for typed structured content, migrations, search, and previews.
- Pure Notes editing transforms for block insertion, text updates, checklist toggles, moves, deletes, and plain-text projection.
- `browserSessionModel.ts` and `browserSessionStorage.ts` for tabs, active tab, capped recents, and versioned session parsing.
- A narrow app-state/session storage helper only if repeated parser/write boilerplate appears across apps.
- A Bun TypeScript submitted-app registry generator/checker that keeps JSON manifests, validation, and Library selectors aligned.

Avoid in v1.3:

- Rich-text editor frameworks such as Lexical, TipTap, ProseMirror, or Slate.
- Raw HTML note storage and sanitizer-driven editing.
- IndexedDB, backend sync, accounts, collaboration, arbitrary app install, or marketplace behavior.
- Redux/Zustand/Jotai/XState or another global state manager.
- Vite-only manifest discovery in shared platform code imported by Bun scripts.

### Table-Stakes Feature Scope

Must ship:

- Backward-compatible richer Notes model that preserves existing notes, folders, timestamps, searchability, previews, and local-only expectations.
- Basic structure-first Notes editing: headings or sections, lists, checklists, durable autosave, and truthful search/preview projection.
- Browser tabs with independent destinations, active-tab state, capped session restore, recent-closed recovery, and per-tab fallback truth.
- Built-in app resume for meaningful context such as Notes selected folder/note, Browser active tab/session, Library category/detail, and optionally Calculator display state.
- Corrupt-state recovery that resets UI state safely without deleting authored content.
- Submitted-app workflow maturity: one manifest source of truth, field-specific validation, draft vs catalog-ready enforcement, catalog freshness, and browse-only Library actions.

Should ship if phase capacity allows:

- Notes outline/jump list or Markdown-like shortcuts after the structured model is stable.
- Browser truth badges and clear session-health messaging.
- Per-app recent-state reset controls that do not delete durable user data.
- Contributor preview/check summary for the exact Library card/detail output.

Defer:

- Notes sync, accounts, collaboration, attachments, scans, locked notes, and native Notes parity.
- Full Browser history, downloads, passwords, private mode, extensions, proxying external sites, or Safari-parity claims.
- Arbitrary submitted-app install/run, permissions, payments, ratings, reviews, or marketplace ranking.

### Architecture And Build-Order Implications

Keep the runtime shell thin. `HomeScreenRuntimeState` should continue to own navigation, active page, origin page, and motion; it should not accumulate Notes selection, Browser tabs, Calculator display, or Library filters.

Use app-owned versioned session snapshots under canonical app namespaces such as:

- `openos.apps.notes.session`
- `openos.apps.browser.session`
- `openos.apps.calculator.session`
- `openos.apps.library.session`

Follow the existing functional-core / imperative-shell split:

- Pure model modules own domain decisions, reducers, normalization, migration, filtering, and projection.
- Storage adapters own localStorage keys, JSON parsing, version migration, malformed payload recovery, and write-failure handling.
- React app shells own DOM events, local drafts, rendering, and effects.
- Platform metadata remains the source for app identity, storage namespace, Settings visibility, placement, and launch surface.

For submitted apps, prefer this flow:

```text
src/features/platform/submitted-apps/*.json
  -> Bun generator/check script
  -> submittedAppRegistry.generated.ts
  -> submittedAppManifests.ts validation/selectors
  -> Library catalog model/UI
```

## Watch-Outs

- Do not implement rich Notes as toolbar-only UI while storage remains flat `title/body`; define v3 storage, migration, and text projection first.
- Do not keep v1.3 resume behavior only in mounted React `useState`; app surfaces unmount when users return home.
- Do not reintroduce Browser split identity: grid and dock Browser launchers must share the canonical Browser namespace.
- Do not let Browser tabs imply remote pages loaded in-app; store and restore `embedded` versus `external-fallback` honestly.
- Do not call `localStorage.setItem` directly from expanding app components without parse/write failure strategy.
- Do not make submitted-app workflow "safer" by adding another hand-maintained registry.
- Do not weaken review boundaries or introduce install/open language for submitted apps.
- Do not let dense Notes/Browser controls break the strict iPhone illusion on small portrait screens.
- Do not rely on v1.2-shaped verification; v1.3 needs migration, return-home, reload, cross-launcher, malformed storage, and generated metadata checks.

## Roadmap Guidance

Suggested phase structure:

1. **State Contracts And Verification Baseline** — define the app-session convention, canonical storage-key expectations, storage failure posture, and `verify:v1.3` skeleton before feature UI expands.
2. **Notes Structured Model And Migration** — add Notes v3 content, pure transforms/projections, malformed/legacy payload recovery, and unit tests before editor controls.
3. **Notes Editor And Resume** — wire structure-first editing, checklists/sections, selected folder/note restore, and WebKit iPhone close/reopen/reload coverage.
4. **Browser Tabs And Session Restore** — implement pure tab reducers, versioned session storage, capped recents/recently closed, grid/dock shared namespace tests, and fallback restore assertions.
5. **Submitted Metadata Workflow Hardening** — add generated or checked registry, raw manifest parsing, duplicate/source-file validation, catalog-ready review enforcement, and contributor preview/check output.
6. **Core App-State Polish And Integrated Regression** — apply session snapshots to Library and optional Calculator, add reset controls only if scoped, run full launcher-path regression, and finalize `verify:v1.3`.

Research flags:

- **Needs phase research or careful phase discussion:** Notes editor UI ergonomics, Browser tab UX on smallest iPhone viewport, storage write-failure UX, submitted registry generation/check details.
- **Standard patterns, likely no extra research needed:** Versioned local snapshots, pure reducers/transforms, app-owned storage adapters, canonical namespace tests, Bun TypeScript validation scripts, aggregate verification command.

Direct requirement seeds:

- Existing v1.2 notes migrate to v1.3, accept structured formatting, reload unchanged, and remain searchable by formatted/checklist text.
- Browser restores multiple tabs after reload, including one embedded openOS destination and one external destination that remains a Safari fallback.
- Opening Browser from grid and dock shows the same tab session.
- Returning home and reopening Notes/Browser/Library restores meaningful context without restoring stale destructive flows.
- Corrupt saved UI state resets safely without deleting Notes content or reviewed catalog metadata.
- A valid catalog-ready manifest reaches Library through the submitted-app workflow without a manual registry edit; invalid fields produce field-specific errors.

## Confidence Assessment

| Area | Confidence | Notes |
| --- | --- | --- |
| Stack | HIGH | All four research files agree that existing React/Vite/TypeScript/Bun/Vitest/Playwright is sufficient; recommended changes are internal modules and scripts. |
| Features | HIGH | Table stakes map directly to v1.2 dependencies and common mobile expectations for notes, tabs, restore, and reviewed catalog metadata. |
| Architecture | HIGH | Current app/platform seams already support app-owned state, canonical storage namespaces, and pure model/storage splits. |
| Pitfalls | HIGH | Risks are project-specific and backed by current v1.2 lessons, existing code paths, and known browser/storage constraints. |

**Overall confidence:** HIGH.

### Gaps To Address During Planning

- Exact Notes editing affordance set needs phase-level trimming so v1.3 ships durable structure without becoming a full editor-engine project.
- Browser history should be scoped carefully; only openOS-managed back/forward behavior is appropriate unless iframe limitations are separately proven.
- Storage quota and blocked-persistence UX need concrete product copy and tests before rich local state expands.
- Library/submission preview UX is product-specific; keep it contributor-oriented and browse-only.

## Sources

Synthesized from:

- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`

The source files cite the relevant repo context, Bright Builds standards, MDN browser/storage references, React state behavior, Apple Notes/Safari/app-state guidance, GitHub workflow documentation, and current openOS v1.2 implementation/test surfaces.

---
*Ready for requirements and roadmap planning.*
