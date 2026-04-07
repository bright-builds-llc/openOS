# Phase 10: App Platform Primitives - Research

**Researched:** 2026-04-06  
**Domain:** internal app-platform primitives, app definitions, settings participation, and storage namespace conventions  
**Confidence:** HIGH

<current_state>
## Current State

- The runtime app model already supports:
  - `id`
  - `label`
  - `icon`
  - `placement`
  - `page`
  - `availability`
  - `launchSurface`
- Phase 9 added page-aware launcher state and selectors.
- There is still no shared platform layer for:
  - settings participation
  - storage namespace conventions
  - internal app-management visibility
  - reusable app-definition helpers
- Existing storage adapters (for install prompt dismissal and standalone launch) use ad hoc `openos.*` keys rather than a shared app/platform namespace system.
</current_state>

<research_summary>
## Summary

Phase 10 should introduce a small, internal-first app-platform layer rather than a broad framework. The most useful primitives now are:

1. a typed app-definition shape or helper used by the runtime registry
2. explicit app platform metadata for:
   - page placement
   - settings participation
   - storage namespace
   - internal app-management visibility
3. selectors/helpers that let future phases consume that metadata without ad hoc wiring

This phase should prove the primitives are real by refactoring the existing runtime registry and current app set to use them. It should not yet build the `Settings` app UI or Notes persistence implementation.

**Primary recommendation:** create an internal app-platform module that defines built-in app manifests through a helper, refactor `appRegistry` onto it, add selectors for settings-visible apps and storage namespaces, and add focused tests that lock the new conventions before `Settings`, `Notes`, and `Browser` depend on them.
</research_summary>

<recommended_approach>
## Recommended Approach

### 1. Replace ad hoc app objects with typed app definitions

Introduce one internal app-definition/module layer that becomes the source of truth for built-in apps.

Benefits:
- platform metadata lives beside app identity
- future apps follow one definition shape
- later phases consume selectors rather than reading raw arrays ad hoc

### 2. Make settings participation explicit

Apps should explicitly declare whether they participate in `Settings` and, if so, what kind of settings presence they expose.

This can stay lightweight, for example:
- hidden
- listed for app info
- listed for future settings management

The important part is that the metadata exists and is queryable.

### 3. Make storage namespaces explicit

Apps that persist local data should have a stable platform storage namespace convention.

This phase does not need to migrate every existing storage adapter, but it should establish:
- a namespace field or derivation rule
- helper(s) to build storage keys
- tests proving the convention

That lets `Notes` land on a clean storage shape instead of inventing one later.

### 4. Add internal app-management selectors

Provide selectors/helpers for:
- apps by page
- apps shown in settings/app management
- app storage namespace lookup

This makes the platform layer immediately useful even before Settings UI exists.
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: building a framework no shipped app uses
Avoid plugin systems, public extension APIs, or marketplace concepts here.

### Pitfall 2: leaving the existing runtime registry untouched
If the old registry shape stays primary, the new “platform” layer becomes dead abstraction immediately.

### Pitfall 3: making storage namespace conventions implicit
If namespaces are just “use app id somewhere,” later phases will still invent incompatible persistence keys.

### Pitfall 4: turning settings participation into UI too early
Phase 10 should provide metadata and selectors; `Settings` UI belongs to Phase 11.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **App definition/platform metadata layer**
   - define the internal app primitive shape
   - refactor the existing built-in registry onto it

2. **Settings/storage/app-management selectors**
   - add explicit settings participation and storage namespace conventions
   - add focused tests

3. **Integration and verification**
   - ensure existing runtime/shell consumers use the new layer
   - run final tests/build to prove the platform layer is not dead abstraction

### Likely files

- `src/features/runtime/appRegistry.ts`
- new platform module(s), likely under `src/features/platform/` or `src/features/runtime/`
- `src/features/shell/data/homeScreenIcons.ts`
- maybe `src/features/runtime/AppSurface.tsx` if it should read platform metadata
- unit tests for the new platform selectors/helpers
</planning_implications>

<sources>
## Sources

- [appRegistry.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts)
- [homeScreenRuntime.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/homeScreenRuntime.ts)
- [homeScreenIcons.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/shell/data/homeScreenIcons.ts)
- [installPromptStorage.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/installPromptStorage.ts)
- [LaunchStateStorage.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/standalone/LaunchStateStorage.ts)
- [v1.1 Architecture Research](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/ARCHITECTURE.md)
</sources>
