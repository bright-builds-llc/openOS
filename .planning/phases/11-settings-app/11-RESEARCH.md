# Phase 11: Settings App - Research

**Researched:** 2026-04-06  
**Domain:** openOS Settings app, preference application/persistence, and internal app/platform management surface  
**Confidence:** HIGH

<current_state>
## Current State

- The codebase now has:
  - shared built-in app definitions
  - settings-participation metadata
  - storage namespace metadata
  - runtime selectors for settings-visible apps and storage-managed apps
- There is no user-facing Settings app yet.
- Existing shell/runtime/app surface infrastructure is ready to host it as a normal implemented app.
- There is also no shared openOS preference store yet; current persistence helpers are feature-specific and ad hoc.
</current_state>

<research_summary>
## Summary

Phase 11 should deliver `Settings` as the first user-visible consumer of the new internal platform layer. The phase needs three things:

1. a shared openOS preference store and typed preference schema
2. a real `Settings` app module wired through the shared runtime path
3. an internal app/platform management surface inside Settings that reads the app metadata added in Phase 10

The Settings app should stay focused on openOS itself, not try to recreate all of iOS Settings. The best first set of settings is:
- wallpaper/background preset
- motion/reduced-motion preference override or openOS motion preference
- browser-entry or install-surface preferences only if they are truly user-facing now
- app/platform info surface driven by the app metadata

**Primary recommendation:** start with a small preference schema and storage adapter, apply those preferences to clearly visible shell behavior, then build Settings UI around grouped sections for Appearance, Motion, and Apps. The “Apps” section should surface platform metadata and internal app-management visibility without becoming a full marketplace or system settings clone.
</research_summary>

<recommended_approach>
## Recommended Approach

### 1. Shared preferences first

Create a typed openOS preferences module before the Settings UI.

It should define:
- preference keys and types
- defaults
- read/write adapter
- a way for the shell to consume effective preferences

This gives Settings something real to manage and lets the phase prove `SETT-02` and `SETT-03`.

### 2. Make preferences visibly affect the shell

Choose a small number of preferences with immediate user-visible effect, for example:
- wallpaper/background preset
- ambient theme variant
- motion preference override layered over system preference

Avoid fake toggles that don’t do anything.

### 3. Use Settings as the first app-management surface

The app-management section can stay internal-first:
- list settings-visible apps
- show app label/icon
- show storage namespace or app info
- show whether the app has future settings participation

This satisfies `SETT-04` without prematurely building a public app catalog.

### 4. Keep Settings visually native to openOS

It should feel like a believable system preferences app, not a generic form dashboard:
- grouped rows/sections
- clear affordances
- coherent shell-hosting inside the existing app surface

The right bar is “first-party-feeling openOS control plane,” not pixel-perfect iOS cloning.
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: building Settings UI before defining real preferences
That produces decorative toggles and weakens trust quickly.

### Pitfall 2: making the app-management surface too ambitious
This phase should not turn into marketplace, permissions, or plugin admin work.

### Pitfall 3: preference persistence leaking into unrelated feature storage
Settings should use a dedicated preference store, not reuse install or launch flags.

### Pitfall 4: overfitting Settings to future apps that do not exist yet
Keep the app-management metadata useful for `Settings`, `Notes`, and `Browser`, not for hypothetical public plugins.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **Preference store and application path**
   - typed preference schema
   - storage adapter
   - shell/application integration for a small set of visible preferences

2. **Settings app UI**
   - implemented app path for `Settings`
   - grouped preference sections and controls
   - local persistence through the shared preference store

3. **Internal app-management surface + verification**
   - settings-visible app list/info driven by Phase 10 metadata
   - browser-level verification for open/apply/persist behavior

### Likely files

- new `src/features/settings/` app module(s)
- new preference store module(s), likely under `src/features/platform/` or `src/features/settings/`
- `src/features/runtime/appRegistry.ts` to flip `settings` from coming-soon to implemented
- `AdaptiveShellFoundation.tsx` and/or shell theme layer for applying visible preferences
- Playwright and unit tests for persistence/application behavior
</planning_implications>

<sources>
## Sources

- [appDefinitions.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appDefinitions.ts)
- [appSettings.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appSettings.ts)
- [appStorage.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appStorage.ts)
- [appRegistry.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts)
- [AppSurface.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/AppSurface.tsx)
- [v1.1 research summary](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/SUMMARY.md)
</sources>
