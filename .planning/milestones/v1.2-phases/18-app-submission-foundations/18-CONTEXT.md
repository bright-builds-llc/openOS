---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 18-2026-04-11T18-46-52
generated_at: 2026-04-11T18:46:52.914Z
---

# Phase 18: App Submission Foundations - Context

**Gathered:** 2026-04-11  
**Status:** Ready for planning  
**Mode:** Yolo

<domain>
## Phase Boundary

Introduce the first repo-driven app submission contract on top of the existing openOS app-platform layer. This phase covers checked-in submission metadata, validation, and contributor documentation. It does not add the in-product catalog UI yet, does not install submitted apps, and does not broaden into trust systems, moderation, pricing, or a general marketplace backend.

</domain>

<decisions>
## Implementation Decisions

### Submission model
- **D-01:** Use checked-in manifest JSON files as the submission source of truth for now.
- **D-02:** Keep the submission contract aligned with the current runtime/app-definition shapes by reusing icon, settings, and storage metadata concepts.
- **D-03:** Treat `catalog-ready` as a reviewed submission state that requires explicit review metadata.

### Workflow
- **D-04:** Add a repo-owned validation command so contributors and CI can verify submission metadata without manual interpretation.
- **D-05:** Keep the contributor workflow documentation inside the repo and point to a sample submission path.

### Scope and truthfulness
- **D-06:** Keep submitted apps hidden from the current Settings/runtime surfaces until later catalog/install phases explicitly broaden that contract.
- **D-07:** Build a metadata source that Phase 19 can consume directly for catalog browsing, instead of inventing a separate catalog-only data source later.

### the agent's Discretion
- Exact manifest field names beyond the required runtime-aligned concepts.
- Exact validator output format, as long as it is actionable and exits non-zero on invalid metadata.
- Exact sample app metadata, as long as it is clearly a repo-driven submission example.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone scope
- `.planning/ROADMAP.md` — Phase 18 goal, scope, and success criteria.
- `.planning/REQUIREMENTS.md` — `PLAT-04`.
- `.planning/STATE.md` — current milestone position after Phase 17.
- `.planning/PROJECT.md` — overall app distribution direction and truthfulness constraints.

### Existing platform seams
- `src/features/platform/appDefinitions.ts` — current built-in runtime app-definition contract.
- `src/features/platform/appSettings.ts` — current Settings participation contract.
- `src/features/platform/appStorage.ts` — current storage metadata and namespace helpers.
- `src/features/runtime/appRegistry.ts` — runtime selectors that Phase 19 catalog work will likely reuse.

### Existing docs and repo workflows
- `README.md` — contributor-facing repo overview.
- `CONTRIBUTING.md` — repo contribution expectations.
- `package.json` — repo-owned validation and test commands.

</canonical_refs>

<specifics>
## Specific Ideas

- The first submission path should feel internal-first and mechanical: checked-in metadata, repo review, and validation, not a pretend live marketplace.
- The metadata should already be rich enough that a future catalog card/detail surface can read it without inventing a second schema.
- The validation command should be usable as a PR gate once Phase 18 lands.

</specifics>

<deferred>
## Deferred Ideas

- Installing submitted apps into the live runtime.
- Public moderation, pricing, or trust/reputation systems.
- A full contributor portal or browser-based submission form.

</deferred>

---
*Phase: 18-app-submission-foundations*  
*Context gathered: 2026-04-11*
