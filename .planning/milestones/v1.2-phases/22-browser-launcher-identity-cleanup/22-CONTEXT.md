---
generated_by: gsd-plan-phase
lifecycle_mode: yolo
phase_lifecycle_id: 22-2026-04-12T01-21-17
generated_at: 2026-04-12T01:21:17.070Z
---

# Phase 22: Browser Launcher Identity Cleanup - Context

**Gathered:** 2026-04-11  
**Status:** Ready for planning  
**Source:** Milestone audit tech-debt follow-up

<domain>
## Phase Boundary

Close the remaining Browser identity and coverage debt without broadening Browser capability. This phase covers explicit shared Browser storage identity across the grid and dock launcher entries plus launcher-path verification that exercises both entrypoints. It does not add Browser tabs, persistence/history features, new navigation behavior, or wider shell/platform scope.

</domain>

<decisions>
## Implementation Decisions

### Identity cleanup
- **D-01:** Make the grid and dock Browser launcher entries share one explicit Browser storage namespace instead of carrying divergent per-entry namespaces.
- **D-02:** Keep separate launcher ids and placements for the home-screen grid and dock. The cleanup is about shared app identity and future-safe storage ownership, not collapsing the launcher model.
- **D-03:** Keep the existing shared `launchSurface: "browser"` wiring and make the storage aliasing equally explicit.

### Verification
- **D-04:** Extend Browser launcher-path verification so it proves both the page-grid Browser icon and the dock Browser icon still reach the same Browser experience.
- **D-05:** Keep the existing direct-entry and truthful external-fallback behavior intact while adding the dock-path proof.

### Metadata surfaces
- **D-06:** Settings should continue to show one canonical Browser management row, and that row should now expose the shared Browser storage namespace.
- **D-07:** Runtime-facing Browser metadata should stay coherent after the cleanup, including app-surface storage metadata and canonical runtime selectors.

### Out of scope
- **D-08:** Do not add Browser persistence/history itself in this phase.
- **D-09:** Do not broaden into new Browser UX, install flows, or additional platform cleanup beyond Browser identity and launcher-path proof.

### the agent's Discretion
- Exact helper shape for expressing a storage namespace alias, as long as the Browser alias is explicit in shared metadata.
- Exact launcher-path assertions, as long as both Browser entrypoints are covered and the truthful fallback path remains protected.
- Exact runtime/settings assertions needed to prove metadata coherence.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit and roadmap context
- `.planning/v1.2-v1.2-MILESTONE-AUDIT.md` — source of the Browser tech debt this phase closes
- `.planning/milestones/v1.1-MILESTONE-AUDIT.md` — original dock-entry coverage note
- `.planning/ROADMAP.md` — Phase 22 roadmap entry and success criteria
- `.planning/STATE.md` — current planning state after Phase 21

### Shared platform/runtime identity seams
- `src/features/platform/appStorage.ts` — storage namespace helper layer
- `src/features/platform/appDefinitions.ts` — Browser launcher entries and shared launch-surface metadata
- `src/features/runtime/appRegistry.ts` — canonical runtime selectors and storage namespace lookups
- `src/features/apps/settings/SettingsApp.tsx` — settings-managed app metadata surface
- `src/features/runtime/AppSurface.tsx` — runtime-facing app metadata surface

### Existing Browser verification
- `tests/e2e/browser-app.spec.ts` — current grid-heavy Browser launcher-path proof
- `tests/e2e/settings.spec.ts` — canonical Browser settings row assertions
- `tests/e2e/fixtures/launcher.ts` — shared launcher helpers for grid/dock entrypoints
- `.planning/phases/17-browser-direct-navigation/17-VERIFICATION.md` — direct-entry/truthful-fallback baseline to preserve

</canonical_refs>

<specifics>
## Specific Ideas

- The cleanup should make future Browser persistence safe by construction instead of relying on "Browser happens to be stateless right now."
- The dock-path verification can stay lightweight as long as it proves the real installed-mode dock icon lands in the same Browser runtime path.
- Browser metadata should read as one coherent app identity everywhere the product exposes it, even though the launcher still has two placements.

</specifics>

<deferred>
## Deferred Ideas

- Browser history, saved recents, tabs, or broader persistence
- More generalized aliasing policy for future multi-entry apps beyond the concrete Browser need
- Additional Browser capability expansion beyond the current truthful direct-navigation model

</deferred>

---
*Phase: 22-browser-launcher-identity-cleanup*  
*Context gathered: 2026-04-11 from milestone audit follow-up*
