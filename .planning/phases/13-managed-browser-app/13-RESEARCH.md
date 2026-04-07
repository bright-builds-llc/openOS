# Phase 13: Managed Browser App - Research

**Researched:** 2026-04-07  
**Domain:** managed-iframe browser surface, curated destinations, and graceful blocked-embed fallback  
**Confidence:** HIGH

<current_state>
## Current State

- The platform layer now provides:
  - shared app definitions
  - page placement
  - settings participation
  - storage namespace metadata
- `Settings` and `Notes` are implemented apps.
- `Browser` still exists only as `browser-grid` and `browser` launcher entries marked `coming-soon`.
- There is no browser destination model, iframe host, or blocked-embed fallback flow yet.
</current_state>

<research_summary>
## Summary

Phase 13 should deliver a truthful, limited Browser app. The key technical constraint is that many sites block iframe embedding through `X-Frame-Options` or CSP `frame-ancestors`, so the Browser app should not claim to browse arbitrary sites.

The safest `v1.1` architecture is:

1. a curated browser destination model
2. a managed iframe host component
3. a first-class external fallback state for destinations that are not safely embeddable

To keep the phase deterministic and testable, the Browser app should rely on explicit destination metadata rather than pretending it can robustly infer all blocked-embed cases at runtime. That means:
- known embed-safe destinations render in the iframe host
- known blocked/external destinations render a graceful fallback with an external-open action
- the app remains honest about its limited scope

**Primary recommendation:** create a typed Browser destination registry with explicit render modes (`embedded` vs `external-fallback`), add a managed iframe host component for embed-safe pages, and use deterministic local fixture pages during verification so the browser app does not depend on third-party sites staying embeddable forever.
</research_summary>

<platform_truth>
## Platform Truth

### Embedding limits

MDN documents that:
- `X-Frame-Options` can block a page from loading in an `<iframe>`
- CSP `frame-ancestors` also controls who may embed a page
- many sites use one or both

Planning implication:
- `Browser` should be a curated/embed-safe browser surface, not a general-purpose browser.
- graceful external fallback is part of the product promise, not an edge case.

### Iframe safety

The managed iframe host should use standard containment controls such as:
- `sandbox` with only the minimal allowances needed
- clear loading/blocked states
- no assumptions of same-origin access to embedded content

### Verification implication

Use deterministic local/browser-controlled destinations where possible:
- one or more local embed-safe fixture pages
- one or more destinations explicitly marked external-only

That keeps the tests stable and honest.
</platform_truth>

<recommended_approach>
## Recommended Approach

### 1. Destination registry first

Create a typed Browser destination model with fields like:
- id
- title
- url
- renderMode: `embedded | external-fallback`
- description / source label

Why:
- drives Browser UI from stable metadata
- avoids scattering embed behavior in component code
- keeps fallback behavior explicit and testable

### 2. Managed iframe host

Create one Browser host component that:
- renders the current destination in an iframe when `renderMode=embedded`
- shows loading state
- stays visually coherent with the existing app shell

Avoid:
- pretending to inspect cross-origin page internals
- adding arbitrary browser chrome or tab systems

### 3. Explicit blocked/external fallback state

For `external-fallback` destinations, show:
- why the page opens externally
- a direct `Open in Safari` / external-open action
- consistent treatment with the rest of openOS

This is better than silently failing or pretending a blank iframe is acceptable.

### 4. Deterministic verification

Browser verification should prove:
- Browser opens from the launcher as a real implemented app
- embedded destinations render inside the managed host
- blocked/external destinations show graceful fallback
- destination switching works

Use local fixture pages or explicit metadata-driven destinations so the suite does not rely on external sites.
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: promising a full browser
This would immediately overstate what the platform can reliably do.

### Pitfall 2: relying on runtime iframe failure heuristics alone
Cross-origin iframe behavior is not a solid foundation for all blocked-embed detection. Use explicit destination metadata for `v1.1`.

### Pitfall 3: mixing Browser with generic app/platform work
Keep this phase about the Browser app and its destination host model, not broader platform design.

### Pitfall 4: using unstable external sites in tests
Use deterministic local fixtures and metadata-driven fallback cases instead.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **Browser destination model + iframe host**
   - destination registry
   - managed iframe component
   - local fixture content if needed

2. **Browser app UI + runtime integration**
   - implemented Browser app path
   - destination switching
   - graceful fallback state and external-open action

3. **Browser verification**
   - launcher open path
   - embedded destination rendering
   - fallback path
   - destination switching

### Likely files

- new `src/features/apps/browser/` modules
- `src/features/platform/appDefinitions.ts` to mark Browser implemented
- `src/features/shell/AdaptiveShellFoundation.tsx`
- maybe local fixture pages under `public/` for deterministic embed-safe destinations
- Playwright spec for Browser behavior
</planning_implications>

<sources>
## Sources

- [MDN: X-Frame-Options header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [MDN: CSP frame-ancestors directive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
- [MDN: iframe embedding technologies](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/General_embedding_technologies)
- [appDefinitions.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appDefinitions.ts)
- [appRegistry.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts)
- [NotesApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/notes/NotesApp.tsx)
- [SettingsApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/settings/SettingsApp.tsx)
</sources>
