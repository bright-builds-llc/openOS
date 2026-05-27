---
phase: 21-submitted-manifest-discovery-hardening
plan: "02"
subsystem: validator-hardening
tags: [submissions, validator, cli, fail-closed]
requires:
  - phase: 21-01
    provides: shared manifest drift detection helper
provides:
  - Validator scan of submitted-app manifest files on disk
  - Fail-closed submission validation on registry drift
  - Actionable CLI drift messaging
affects: [submission-review, catalog-safety]
tech-stack:
  added: []
  patterns: [disk-scan before content validation, actionable drift errors]
key-files:
  created:
    - .planning/phases/21-submitted-manifest-discovery-hardening/21-02-SUMMARY.md
  modified:
    - scripts/validate-submitted-apps.ts
    - src/features/platform/submittedAppManifests.ts
key-decisions:
  - "Made submission validation fail before content validation whenever on-disk manifest files and the registered set diverge."
patterns-established:
  - "bun run submissions:check now proves both content validity and registry/filesystem agreement."
requirements-completed: []
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 21-2026-04-11T21-45-01
generated_at: 2026-04-11T22:19:30Z
duration: 8min
completed: 2026-04-11
---

# Phase 21 Plan 02 Summary

**The submitted-manifest validator now fails closed when the registry and on-disk manifest set drift apart**

## Accomplishments

- Updated `scripts/validate-submitted-apps.ts` to scan `src/features/platform/submitted-apps/` before content validation.
- Wired the validator to the shared drift-detection helper instead of duplicating registry comparison logic.
- Added actionable CLI output for `unregistered_on_disk` and `registered_missing_file` cases while preserving the clean success summary.

## Verification

- `bun run submissions:check`
- `bun x tsc --noEmit`

## Notes

- The validator now protects both submission review and catalog inclusion from silent manifest drift.
