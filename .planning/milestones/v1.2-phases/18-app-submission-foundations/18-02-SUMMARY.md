---
phase: 18-app-submission-foundations
plan: "02"
subsystem: submission-validation-workflow
tags: [platform, submissions, scripts, validation, workflow]
requires:
  - phase: 18-01
    provides: submitted app manifest contract
provides:
  - Repo-owned submission validation script
  - Package-script entrypoint for submission review
  - Actionable CLI output for invalid metadata
affects: [contributor-workflow, future-ci]
tech-stack:
  added: []
  patterns: [repo-native validation command, actionable manifest validation output]
key-files:
  created:
    - .planning/phases/18-app-submission-foundations/18-02-SUMMARY.md
    - scripts/validate-submitted-apps.ts
  modified:
    - package.json
key-decisions:
  - "Made submission validation a repo-native command so future CI and local contributor loops can run the same check."
patterns-established:
  - "Catalog-ready status now depends on a repo-owned validation pass instead of docs-only review."
requirements-completed: [PLAT-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 18-2026-04-11T18-46-52
generated_at: 2026-04-11T18:49:50Z
duration: 10min
completed: 2026-04-11
---

# Phase 18 Plan 02 Summary

**Submitted app metadata is now validated through a repo-owned command instead of manual interpretation alone**

## Accomplishments

- Added `scripts/validate-submitted-apps.ts` to validate all checked-in submission manifests and fail fast with actionable field-level errors.
- Exposed the validation workflow through `bun run submissions:check`.
- Kept the validator thin by reusing the shared submission manifest module instead of reimplementing schema logic in the script.

## Verification

- `bun run submissions:check`
- `bun x tsc --noEmit`
- `bun run build`

## Notes

- The validation command is intentionally local and repo-driven, which keeps this phase clear of marketplace/backend scope.
