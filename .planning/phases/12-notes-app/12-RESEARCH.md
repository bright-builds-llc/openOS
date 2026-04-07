# Phase 12: Notes App - Research

**Researched:** 2026-04-06  
**Domain:** local-only Notes app, local persistence boundaries, and honest no-sync messaging  
**Confidence:** HIGH

<current_state>
## Current State

- The platform layer now provides:
  - shared built-in app definitions
  - storage namespace metadata
  - settings participation metadata
- `Settings` is implemented and the shell has a shared openOS preference store.
- `Notes` still exists only as a coming-soon app entry in the registry.
- There is no shared note storage/repository yet.
</current_state>

<research_summary>
## Summary

Phase 12 should deliver a local-only Notes app with honest persistence boundaries. The key design constraints are:

1. Notes must persist locally across relaunches.
2. The app must make it clear that sync does not exist yet.
3. The persistence layer should consume the shared app-storage convention from Phase 10.

The safest architecture is:
- a dedicated notes repository/storage adapter
- a small Notes domain model (note id, title/preview/content, timestamps)
- a real Notes app UI with list + editor flow
- a visible local-only/no-sync banner that does not feel like an afterthought

**Primary recommendation:** create a dedicated Notes storage module first, using the Phase 10 storage namespace convention to anchor the persistence path, then implement a straightforward split or stacked Notes UI for list/open/edit/delete/create behavior. The no-sync messaging should be persistent and visible near the list/editor entry, not hidden in a footnote.
</research_summary>

<recommended_approach>
## Recommended Approach

### 1. Repository first

Define the Notes domain and storage adapter before the UI:
- note record shape
- list/create/update/delete helpers
- persistence serialization

That keeps Notes logic testable and prevents the UI from becoming the data layer.

### 2. Keep the editing model simple

`v1.1` Notes only needs:
- list notes
- create note
- edit note
- delete note
- reopen saved note

No folders, search, sync, or rich text here.

### 3. Make local-only messaging integral

The warning should be visible and clear:
- notes live only in this browser/device for now
- no syncing/account recovery yet

This is part of trust and product honesty, not just legal copy.

### 4. Keep Notes native to openOS

The Notes app should feel like a real built-in app hosted by the shared runtime:
- open from home screen
- use the shared app surface and motion path
- visually coherent with the existing shell
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: storing notes in component state with ad hoc serialization
That will make persistence brittle and hard to test.

### Pitfall 2: burying the local-only warning
If users can miss it, the app overpromises by omission.

### Pitfall 3: turning Notes into a mini-doc editor
Stay with plain local note CRUD for this milestone.

### Pitfall 4: mixing Notes persistence with global Settings or install storage
Notes should have its own repository backed by the shared app-storage namespace convention.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **Notes domain + persistence**
   - note model
   - repository/storage adapter
   - unit coverage

2. **Notes app UI**
   - implemented app path
   - notes list + open/edit/create/delete flow
   - local-only/no-sync messaging

3. **Browser-level verification**
   - open Notes through the launcher
   - create/edit/reopen persisted note
   - assert local-only warning is visible

### Likely files

- new `src/features/apps/notes/` modules
- maybe `src/features/platform/` only if a tiny storage helper extension is needed
- `src/features/runtime/appRegistry.ts` to mark Notes implemented
- Playwright spec for Notes behavior
</planning_implications>

<sources>
## Sources

- [appDefinitions.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appDefinitions.ts)
- [appStorage.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appStorage.ts)
- [SettingsApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/settings/SettingsApp.tsx)
- [AppSurface.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/AppSurface.tsx)
- [v1.1 research summary](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/SUMMARY.md)
</sources>
