---
phase: 18-app-submission-foundations
plan: "03"
subsystem: submission-docs
tags: [platform, submissions, docs, readme, contributor-workflow]
requires:
  - phase: 18-02
    provides: repo-owned submission validation workflow
provides:
  - Submission workflow documentation
  - README discovery path for submission foundations
  - Final verification lock for Phase 18
affects: [contributor-onboarding, catalog-phase]
tech-stack:
  added: []
  patterns: [docs-linked repo workflow, sample-path documentation, validator discoverability]
key-files:
  created:
    - .planning/phases/18-app-submission-foundations/18-03-SUMMARY.md
    - docs/app-submissions.md
  modified:
    - README.md
key-decisions:
  - "Documented the submission path as repo metadata plus validation, not as a pretend public app store flow."
patterns-established:
  - "Contributors can now find the submission manifest path and validation command from the main repo entrypoint."
requirements-completed: [PLAT-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 18-2026-04-11T18-46-52
generated_at: 2026-04-11T18:49:50Z
duration: 9min
completed: 2026-04-11
---

# Phase 18 Plan 03 Summary

**The first repo-driven submission workflow is now documented and discoverable from the repo entrypoint**

## Accomplishments

- Added `docs/app-submissions.md` with the manifest path, contract overview, sample submission, and validation commands.
- Added a short README section that points contributors to the submission foundations and `bun run submissions:check`.
- Ran the full repo verification gate after the submission foundation work landed.

## Verification

- `bun run submissions:check`
- `bun run test`
- `bun x tsc --noEmit`
- `bun run build`
- `bun run test:e2e --project=webkit-iphone`

## Notes

- The documentation keeps the scope explicit: checked-in submission metadata now, catalog browsing later, installation later still.
