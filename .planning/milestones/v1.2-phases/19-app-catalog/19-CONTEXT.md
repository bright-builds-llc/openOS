---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 19-2026-04-11T19-00-30
generated_at: 2026-04-11T19:00:30.974Z
---

# Phase 19: App Catalog - Context

**Gathered:** 2026-04-11  
**Status:** Ready for planning  
**Mode:** Yolo

<domain>
## Phase Boundary

Expose the first in-product app catalog surface from the shared submission metadata source introduced in Phase 18. This phase covers the built-in app surface, catalog selectors, and browse/detail UI. It does not install submitted apps, does not surface a marketplace checkout or moderation flow, and does not expand into arbitrary app activation.

</domain>

<decisions>
## Implementation Decisions

### Catalog surface
- **D-01:** Implement the first in-product catalog as the existing `Library` app rather than adding a brand-new launcher icon.
- **D-02:** Drive the catalog entirely from validated `catalog-ready` submitted app manifests rather than inventing a separate catalog-only data source.
- **D-03:** Keep the catalog browse-only for now and make that status explicit in the product copy.

### Data and browsing
- **D-04:** Add at least one more valid submission entry so the first catalog browse flow has real choice and category browsing instead of a single-item shell.
- **D-05:** Support category-based browsing and in-product detail viewing without overextending into search, install, or account scope.

### Truthfulness and scope
- **D-06:** The catalog should help users inspect app info now, but must stay explicit that installation comes later.
- **D-07:** Keep the submission metadata and catalog selectors reusable for Phase 20 verification.

### the agent's Discretion
- Exact category selector names and entry/detail layout.
- Exact catalog visual treatment, as long as it stays coherent with the built-in app shell and avoids generic marketplace-card clutter.
- Exact integration test coverage, as long as it proves launcher-path browsing and metadata-driven detail rendering.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone scope
- `.planning/ROADMAP.md` — Phase 19 goal, scope, and success criteria.
- `.planning/REQUIREMENTS.md` — `PLAT-05`.
- `.planning/STATE.md` — current milestone position after Phase 18.
- `.planning/PROJECT.md` — broader distribution direction and truthfulness constraints.

### Submission foundations
- `src/features/platform/submittedAppManifests.ts` — validated submission metadata source.
- `src/features/platform/submitted-apps/` — checked-in sample submissions.
- `docs/app-submissions.md` — contributor workflow introduced in Phase 18.

### Existing app/runtime seams
- `src/features/platform/appDefinitions.ts` — current `Library` app definition and launcher placement.
- `src/features/runtime/appRegistry.ts` — runtime selectors for the built-in app surface.
- `src/features/shell/AdaptiveShellFoundation.tsx` — app-surface routing.
- `src/features/runtime/ComingSoonApp.tsx` — current placeholder behavior the catalog will replace for `Library`.

</canonical_refs>

<specifics>
## Specific Ideas

- The catalog should feel like a built-in browse surface, not like a full consumer app store yet.
- Category browse plus detail inspection is enough for this phase if the detail surface is meaningful.
- The first screen should make the “browse now, install later” truth obvious without feeling apologetic.

</specifics>

<deferred>
## Deferred Ideas

- Installing submitted apps into the launcher/runtime.
- Search across catalog entries.
- Ratings, pricing, or public marketplace trust systems.

</deferred>

---
*Phase: 19-app-catalog*  
*Context gathered: 2026-04-11*
