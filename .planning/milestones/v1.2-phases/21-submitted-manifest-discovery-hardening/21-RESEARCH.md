# Phase 21: Submitted Manifest Discovery Hardening - Research

**Researched:** 2026-04-11  
**Domain:** submitted manifest discovery, validator/catalog drift prevention, and repo-driven distribution workflow hardening  
**Confidence:** HIGH

<current_state>
## Current State

- Submitted app metadata is currently defined in checked-in JSON files under `src/features/platform/submitted-apps/`.
- The shared catalog/validation source in `submittedAppManifests.ts` still uses manual imports for each manifest file.
- `scripts/validate-submitted-apps.ts` validates only the imported manifest set, so a JSON file added on disk but not registered in `submittedAppManifests.ts` would be silently skipped by both validation and catalog inclusion.
- The `v1.2` milestone audit flagged that seam as the highest-risk remaining distribution workflow debt.
</current_state>

<research_summary>
## Summary

Phase 21 should fail closed on manifest-registry drift without broadening the workflow into install/runtime work or a new backend. The safest and smallest robust path for this repo is:

1. keep the shared imported registry as the browser/runtime-safe catalog source
2. add an explicit drift-detection helper that compares registered manifests to the JSON files present on disk
3. make `bun run submissions:check` fail when any manifest file is unregistered or any registered manifest no longer has a matching file
4. cover the drift logic with focused unit tests and update contributor docs so the hardened workflow is explicit

**Primary recommendation:** do not switch the runtime/catalog module to `import.meta.glob()` discovery. Because the same metadata module is consumed by a Bun CLI validator and by app/runtime code, the more robust near-term solution is explicit registry plus mandatory filesystem drift detection in the validator. This removes silent omission while keeping the catalog source deterministic in both environments.
</research_summary>

<implementation_options>
## Implementation Options

### Option 1: Replace manual imports with `import.meta.glob()` discovery

**Pros**
- Reduces manual registration in app code
- Makes on-disk discovery automatic in Vite/browser builds

**Cons**
- `import.meta.glob()` is Vite-specific and does not naturally serve the Bun CLI path that runs `scripts/validate-submitted-apps.ts`
- Would likely force environment-specific branching or a second discovery path, increasing complexity in the exact seam we want to simplify
- Harder to unit-test outside bundled execution

**Conclusion**
- Not the best fit for this repo right now

### Option 2: Keep manual registry, add validator drift detection

**Pros**
- Smallest change to the current architecture
- Preserves deterministic imported metadata for the browser/runtime path
- Makes the existing validator fail closed when on-disk manifests are not represented in the registry
- Easy to unit-test with pure helper inputs plus one script-level filesystem scan

**Cons**
- Still requires registry maintenance
- Does not remove the explicit import step; it only guarantees drift is caught

**Conclusion**
- Best near-term fit for this repo and phase scope

### Option 3: Introduce a generated manifest index file

**Pros**
- Could unify discovery for browser/runtime and CLI if generation happens first
- Reduces manual import churn after the generator exists

**Cons**
- Adds generation lifecycle complexity, stale-generated-file risk, and another workflow surface
- Larger than needed for a gap-closure phase

**Conclusion**
- Reasonable future evolution, but too heavy for this cleanup phase
</implementation_options>

<recommended_approach>
## Recommended Approach

### 1. Add a pure drift-detection helper near the submitted manifest source

Introduce a helper that takes:
- the registered manifest set
- the manifest filenames discovered on disk

and returns:
- on-disk files missing from the registry
- registry entries that no longer have a backing file
- any filename/id mismatch warnings if desired

This makes the drift logic unit-testable without tying tests to filesystem APIs.

### 2. Make the validator scan `submitted-apps/` directly

In `scripts/validate-submitted-apps.ts`:
- read the JSON filenames under `src/features/platform/submitted-apps/`
- compare them to the registered manifest ids/source set
- fail before the normal metadata validation pass if drift exists

This satisfies the audit requirement that new manifest files cannot be silently skipped.

### 3. Preserve one catalog source of truth

Keep `submittedAppManifests.ts` as the shared catalog-ready registry consumed by `AppCatalogApp.tsx`.
The validator’s job is not to create a second source of truth; it is to prove the shared source matches the files on disk.

### 4. Update docs to reflect the hardened workflow

`docs/app-submissions.md` should explicitly say:
- add the JSON file
- register it in the shared manifest module
- run `bun run submissions:check`
- the validator now fails if on-disk files and the shared registry diverge
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: moving discovery logic into only the CLI

If the validator knows about all files but the runtime/catalog still references a separate stale registry with no enforced comparison, drift remains possible. The comparison must be framed as validation of the shared registry, not a parallel source.

### Pitfall 2: treating filename presence as enough

The drift check should compare normalized manifest ids/expected filenames, not just count files. A renamed or mismatched manifest can still be wrong even if totals line up.

### Pitfall 3: over-engineering with code generation

This is a gap-closure phase. Adding a generator, watch pipeline, or prebuild indexing layer would create more lifecycle surface than the current debt justifies.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **Shared drift-detection model**
   - add helper(s) for registry-vs-filesystem comparison
   - add focused unit coverage

2. **Validator hardening**
   - scan `src/features/platform/submitted-apps/`
   - fail closed on unregistered/missing manifest files
   - keep existing metadata validation intact

3. **Workflow/docs closeout**
   - update submission docs
   - run `bun run submissions:check`, `bun run test`, `bun x tsc --noEmit`, `bun run build`

### Likely files

- `src/features/platform/submittedAppManifests.ts`
- `src/features/platform/submittedAppManifests.test.ts`
- `scripts/validate-submitted-apps.ts`
- `docs/app-submissions.md`
</planning_implications>

<sources>
## Sources

- [.planning/v1.2-v1.2-MILESTONE-AUDIT.md](/Users/peterryszkiewicz/Repos/iCeption/.planning/v1.2-v1.2-MILESTONE-AUDIT.md)
- [.planning/ROADMAP.md](/Users/peterryszkiewicz/Repos/iCeption/.planning/ROADMAP.md)
- [.planning/STATE.md](/Users/peterryszkiewicz/Repos/iCeption/.planning/STATE.md)
- [submittedAppManifests.ts](/Users/peterryszkiewicz/Repos/iCeption/src/features/platform/submittedAppManifests.ts)
- [validate-submitted-apps.ts](/Users/peterryszkiewicz/Repos/iCeption/scripts/validate-submitted-apps.ts)
- [app-submissions.md](/Users/peterryszkiewicz/Repos/iCeption/docs/app-submissions.md)
- [AppCatalogApp.tsx](/Users/peterryszkiewicz/Repos/iCeption/src/features/apps/catalog/AppCatalogApp.tsx)
</sources>
