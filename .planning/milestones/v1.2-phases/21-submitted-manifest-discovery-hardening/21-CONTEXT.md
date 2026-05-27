---
generated_by: gsd-plan-phase
lifecycle_mode: yolo
phase_lifecycle_id: 21-2026-04-11T21-45-01
generated_at: 2026-04-11T21:45:01.035Z
---

# Phase 21: Submitted Manifest Discovery Hardening - Context

**Gathered:** 2026-04-11  
**Status:** Ready for planning  
**Source:** Milestone audit tech-debt follow-up

<domain>
## Phase Boundary

Harden the submitted-manifest discovery path so submitted app JSON files cannot be silently skipped between repo validation and the in-product catalog source. This phase covers manifest discovery/registration hardening, validator tightening, and documentation updates. It does not add new catalog UI, install flows, or broader marketplace capability.

</domain>

<decisions>
## Implementation Decisions

### Gap closure scope
- **D-01:** Eliminate the manual registration risk called out in the `v1.2` milestone audit for submitted app manifests.
- **D-02:** Keep the catalog and submission validator on one trustworthy source of truth for discovered manifest files.
- **D-03:** Treat undiscovered or unregistered manifest files as a validation failure rather than allowing silent omission.

### Workflow and docs
- **D-04:** Preserve the checked-in JSON manifest workflow from Phase 18; harden discovery, do not replace it with a form or service.
- **D-05:** Update contributor-facing documentation so the hardened manifest workflow remains accurate.

### Out of scope
- **D-06:** Do not broaden into install/runtime activation, public marketplace flows, or new catalog UX.

### the agent's Discretion
- Exact discovery mechanism, as long as the catalog source and validator cannot drift.
- Exact validator failure messaging, as long as it clearly identifies missing registration/discovery issues.
- Exact docs changes needed to keep contributor instructions accurate.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit and roadmap context
- `.planning/v1.2-v1.2-MILESTONE-AUDIT.md` — source of the tech debt this phase closes
- `.planning/ROADMAP.md` — Phase 21 roadmap entry and milestone context
- `.planning/STATE.md` — current planning state after gap-phase creation
- `.planning/REQUIREMENTS.md` — current milestone requirement map

### Submission/catalog source of truth
- `src/features/platform/submittedAppManifests.ts` — current manual manifest registry
- `src/features/platform/submitted-apps/` — checked-in submitted manifest JSON files
- `scripts/validate-submitted-apps.ts` — current validator entrypoint
- `docs/app-submissions.md` — contributor workflow docs
- `src/features/apps/catalog/AppCatalogApp.tsx` — current consumer of catalog-ready submissions

</canonical_refs>

<specifics>
## Specific Ideas

- The ideal outcome is that adding a new manifest file cannot accidentally bypass both validation and catalog inclusion.
- Hardening should stay mechanical and repo-driven, not architectural theater.
- If automatic discovery is impractical, the validator must at least fail loudly when on-disk manifests are missing from the shared registry.

</specifics>

<deferred>
## Deferred Ideas

- Install/runtime activation for submitted apps
- Marketplace moderation or trust systems
- Catalog search or richer catalog discovery UX

</deferred>

---
*Phase: 21-submitted-manifest-discovery-hardening*  
*Context gathered: 2026-04-11 from milestone audit follow-up*
