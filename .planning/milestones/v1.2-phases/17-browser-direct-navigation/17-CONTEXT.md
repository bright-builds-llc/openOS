---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 17-2026-04-11T18-37-19
generated_at: 2026-04-11T18:37:19.390Z
---

# Phase 17: Browser Direct Navigation - Context

**Gathered:** 2026-04-11  
**Status:** Ready for planning  
**Mode:** Yolo

<domain>
## Phase Boundary

Let the Browser app accept direct URLs and broaden navigation beyond the curated list without pretending iframe support exists for arbitrary sites. This phase covers address entry, URL normalization, broader destination handling, and honest fallback behavior. It does not attempt tabs, Safari parity, general-purpose session history, or claims that arbitrary remote sites will always embed inline.

</domain>

<decisions>
## Implementation Decisions

### Navigation model
- **D-01:** Add a real address-entry flow inside the Browser app instead of hiding navigation behind curated shortcut tiles only.
- **D-02:** Normalize bare domains to `https://` and allow same-origin/local openOS paths directly.
- **D-03:** Treat same-origin/local URLs as embeddable in the current shell and treat unknown external http(s) URLs as honest external-fallback destinations unless they already match a known curated destination.
- **D-04:** Keep the original curated destinations as suggested shortcuts, not as the only navigation path.

### Truthfulness and scope
- **D-05:** The app must never imply arbitrary remote iframe support. If a destination is not known-safe for inline rendering in this shell, show explicit Safari fallback copy instead.
- **D-06:** Do not broaden the phase into tabs, persistent full history, sync, or Safari-style browser chrome.

### UX
- **D-07:** The Browser UI should make direct entry and suggested destinations coexist cleanly.
- **D-08:** Recent manually entered destinations may be surfaced inside the app if they remain lightweight and phase-scoped.

### the agent's Discretion
- Exact normalization helper names and destination object shape.
- Exact address-bar and recent-destination layout, as long as the app remains coherent on portrait mobile sizes.
- Exact verification coverage, as long as it proves direct URL entry, non-curated navigation, and honest fallback.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone scope
- `.planning/ROADMAP.md` — Phase 17 goal, scope, and success criteria.
- `.planning/REQUIREMENTS.md` — `BROW-05` and `BROW-06`.
- `.planning/STATE.md` — current milestone position after Phase 16.
- `.planning/PROJECT.md` — truthfulness bar and Browser constraints.

### Existing Browser implementation
- `src/features/apps/browser/BrowserApp.tsx` — current curated-only Browser surface.
- `src/features/apps/browser/browserDestinations.ts` — current hardcoded destinations and render modes.
- `src/features/apps/browser/BrowserFrame.tsx` — current embedded Browser surface.
- `src/features/apps/browser/browser.css` and `browserFrame.css` — current Browser styling.
- `tests/e2e/browser-app.spec.ts` — current launcher-path Browser verification.

### Shared runtime/platform seams
- `src/features/runtime/appRegistry.ts` — canonical Browser runtime metadata path.
- `src/features/platform/appDefinitions.ts` — Browser launcher entries and launch surface metadata.

</canonical_refs>

<specifics>
## Specific Ideas

- Direct entry should feel like a believable next step for the existing managed Browser, not like a fake full Safari clone.
- The app should stay explicit about why a direct URL may still open externally.
- Verification should prove at least one non-curated direct URL works through inline embedding and at least one direct external URL takes the honest fallback path.

</specifics>

<deferred>
## Deferred Ideas

- Browser tabs, pinned sites, or broader session history.
- Claims of general-purpose inline browsing across arbitrary third-party sites.
- Browser sync, bookmarks, or installable-web shortcuts.

</deferred>

---
*Phase: 17-browser-direct-navigation*  
*Context gathered: 2026-04-11*
