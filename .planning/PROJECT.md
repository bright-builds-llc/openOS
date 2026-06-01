# openOS

## What This Is

openOS is a shipped mobile web experience that aims to feel nearly indistinguishable from using an iPhone when opened fullscreen on an iPhone in portrait mode. It now includes page-aware home screens, persistent `Settings`, local-first `Notes` with structured block editing, search, folders, and resume state, a truthful direct-entry `Browser`, and a repo-driven app distribution surface anchored by reviewed submissions and an in-product `Library` catalog.

Longer term, the project still aims to become an open platform for browser-native "virtual iOS apps," including richer Notes capability, more capable browsing without dishonest claims, and an eventual install escape hatch built on top of reviewed app metadata.

## Core Value

When launched fullscreen on an iPhone, the experience must feel convincingly like using iOS, starting with the home screen, motion system, and Calculator.

## Current State

- **Shipped version:** `v1.2` on 2026-04-11
- **User-facing surface:** install-first Safari onboarding, adaptive shell, shared launcher/runtime/motion system, multi-page home screens, high-fidelity Calculator, real `Settings`, structured local `Notes` with folders, search, checklist/heading editing, and editor resume, a truthful direct-entry `Browser`, reviewed submitted app manifests, and the first in-product `Library` app catalog
- **Verification:** `v1.2` milestone audit was refreshed on 2026-05-27 after `bun run verify:v1.2`, and Phase 25 of `v1.3` passed `bun run verify:v1.3` on 2026-06-01, covering focused Notes/session tests, the full unit suite, explicit typecheck, production build, and `19` WebKit iPhone launcher-path tests
- **Codebase:** React 19, Vite 8, TypeScript 6, Vitest 4, Playwright 1.59, with about `12,734` lines of TypeScript/TSX in `src/` and `tests/`

## Current Milestone: v1.3 Stateful Apps & Platform Maturity

**Goal:** Make existing apps feel more stateful and trustworthy by deepening local Notes and Browser workflows while reducing platform submission/catalog drift before any backend-heavy sync or arbitrary install expansion.

**Target features:**

- Richer local Notes editing and structure that builds on the existing search/folder model.
- Browser tabs and session state that preserve the current truthfulness bar around embed limitations and fallback behavior.
- Safer submitted-app metadata workflow so reviewed submissions, validation, and the Library catalog stay aligned with less manual registry upkeep.
- Core app-state polish where returning to built-in apps restores meaningful context instead of feeling like a fresh launch.

## Requirements

### Validated

- ✓ Install-first Safari onboarding and standalone Home Screen launch flow — `v1`
- ✓ Adaptive portrait iPhone shell, shared launcher/runtime/motion system, and high-fidelity Calculator — `v1`
- ✓ Multi-page home-screen behavior with launcher return-to-origin semantics — `v1.1`
- ✓ Reusable internal app-platform primitives for app definitions, settings participation, and storage namespaces — `v1.1`
- ✓ Real `Settings` app with persistent preferences and internal app-management surface — `v1.1`
- ✓ Real local-only `Notes` app with browser-verified persistence and honest no-sync messaging — `v1.1`
- ✓ Truthful managed-iframe `Browser` with curated destinations, graceful fallback, and integrated launcher-path verification — `v1.1`
- ✓ Users can search notes by title and body text — `v1.2`
- ✓ Users can organize notes using folders or tags and browse notes through that structure — `v1.2`
- ✓ Users can enter destinations directly in `Browser` and browse beyond the original curated set without dishonest capability claims — `v1.2`
- ✓ Contributors can submit apps through a repo-driven review workflow — `v1.2`
- ✓ Users can browse apps in an in-product app catalog — `v1.2`
- ✓ The repo exposes one canonical verification command for milestone-defining submission, Notes, Browser, and catalog flows — `v1.2`
- ✓ Existing v1.2 Notes data migrates into the v1.3 structured local model without losing title, body text, folder, timestamps, or searchability — Phase 24
- ✓ Structured Notes content remains searchable and previewable while the existing plain title/body UI stays compatible — Phase 24
- ✓ Users can edit local notes with richer formatting or structure than plain text without losing existing notes — Phase 25
- ✓ Users can create and update checklist or list content inside a local note — Phase 25
- ✓ Users can return to Notes and resume the last meaningful folder, note, and edit context after navigating home or reloading — Phase 25

### Active

- [ ] Users can use multiple Browser tabs and recover recent Browser context across app relaunches or refreshes.
- [ ] Users can return to core built-in apps and resume meaningful local app state.
- [ ] Contributors can maintain reviewed submitted-app metadata through a safer workflow that keeps validation and the Library catalog aligned.

### Out of Scope

- Landscape mode until the portrait iPhone experience remains strong as the product grows.
- Widgets, notifications, and lock screen system surfaces before the app platform and core shell mature further.
- Literal Apple logos and related marks.
- Backend-heavy notes sync before the local Notes model proves stable over time.
- Full Safari-parity browsing claims until the project can keep them truthful.
- Arbitrary app install flows before the reviewed submission/catalog path matures further.

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? Move to Out of Scope with reason.
2. Requirements validated? Move to Validated with phase reference.
3. New requirements emerged? Add to Active.
4. Decisions to log? Add to Key Decisions.
5. "What This Is" still accurate? Update if drifted.

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections.
2. Core Value check: still the right priority?
3. Audit Out of Scope: reasons still valid?
4. Update Context with current state.

## Context

`v1` proved the install boundary, shell fidelity, shared launcher/runtime path, motion system, and first real app. `v1.1` then proved openOS could grow carefully without breaking the illusion by adding multi-page home screens, real built-in apps, and the first shared app-platform seams.

`v1.2` validated the next layer of utility and platform growth. Notes is now useful beyond a flat local notebook, Browser can handle typed destinations without pretending to be full Safari, contributors have a repo-native submission workflow, and users can browse a first in-product app catalog. Two follow-up hardening phases also closed the milestone audit’s remaining workflow and Browser identity gaps without reopening product scope.

`v1.3` has now validated the local Notes foundation through Phase 25. Durable Notes data migrated to a structured model, the editor can author paragraph, heading, and checklist blocks without adopting a rich-text engine, and disposable Notes session state restores meaningful folder, note, search, and block context after home navigation or reload.

## Constraints

- **Platform:** Mobile web on iPhone in portrait remains the primary target.
- **Installation model:** Fullscreen installed web app is still the intended experience.
- **Responsive fidelity:** Support essentially all portrait iPhone sizes without weakening the illusion.
- **Interaction fidelity:** Home screen, motion, touch response, and built-in app quality remain non-negotiable.
- **Architecture:** Keep app identity, launcher behavior, settings participation, storage ownership, and app-catalog metadata on shared runtime/platform seams.
- **Verification:** Maintain browser-level regression coverage for illusion-critical and milestone-defining user flows.
- **Brand/IP:** Avoid literal Apple marks while pursuing close UX parity.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Make installed fullscreen usage the primary target on iPhone | The illusion is materially stronger without browser chrome | ✓ Validated in `v1` |
| Build an extensible app model early instead of a Calculator-only demo | Future apps and platform work needed shared launcher/runtime seams from the start | ✓ Validated in `v1` |
| Keep Browser truthful and limited to curated/embed-safe destinations until the shell can prove broader behavior honestly | Arbitrary browsing is constrained by iframe embedding policy and would be dishonest to overclaim | ✓ Validated in `v1.1`, expanded carefully in `v1.2` |
| Keep Notes local-first while proving search and organization before sync/accounts | Utility can increase without dragging backend and identity scope into the next milestone | ✓ Validated in `v1.2` |
| Use shared platform metadata as the source of truth for app identity, settings participation, storage, submissions, and catalog entries | Multiple built-in and submitted apps needed one reusable contract instead of ad hoc wiring | ✓ Validated across `v1.1` and `v1.2` |
| Close milestone audit gaps with focused hardening phases instead of reopening broad scope | Preserved momentum while fixing the actual workflow and Browser identity risks | ✓ Validated in `v1.2` |
| Keep Notes structured content as an internal typed model before adding richer editor affordances | Phase 24 proved migration, search, previews, and existing textarea compatibility without adopting a rich-text editor framework | ✓ Validated in Phase 24 |
| Keep Notes rich editing lightweight and local-first before sync/accounts | Phase 25 proved structured block editing, checklist authoring, and editor resume through local durable/session storage without adding a rich-text engine or backend scope | ✓ Validated in Phase 25 |

## Next Milestone Goals

- Explore the next Notes step, likely sync/accounts or richer editing, only after confirming the local information model remains the right base.
- Broaden Browser state carefully, likely through tabs or lightweight persistence, without weakening the current truthfulness bar.
- Simplify the submitted-app workflow so reviewed metadata is safer and easier to maintain before any arbitrary install escape hatch is attempted.

<details>
<summary>Archived milestone framing</summary>

### Completed Milestones

- `v1.2 Notes, Browser & Platform Growth` shipped on 2026-04-11 after Phases 16-22 and a passing milestone audit.
- `v1.1 Core Apps & Platform Foundations` shipped on 2026-04-09 after Phases 9-15 and a passing milestone audit.

</details>

---
*Last updated: 2026-06-01 after completing Phase 25*
