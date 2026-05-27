---
phase: 17-browser-direct-navigation
plan: "01"
subsystem: browser-navigation-model
tags: [browser, url-entry, fallback, vitest, truthfulness]
requires: []
provides:
  - Direct Browser URL normalization and classification helpers
  - Curated-destination reuse for matching typed URLs
  - Focused unit coverage for direct navigation semantics
affects: [browser-ui, browser-verification]
tech-stack:
  added: []
  patterns: [normalized address entry, same-origin embed classification, truthfulness-first fallback]
key-files:
  created:
    - .planning/phases/17-browser-direct-navigation/17-01-SUMMARY.md
  modified:
    - src/features/apps/browser/browserDestinations.ts
    - src/features/apps/browser/browserDestinations.test.ts
key-decisions:
  - "Typed URLs that resolve to existing curated destinations reuse those destinations instead of creating duplicates."
  - "Unknown external http(s) URLs are explicitly classified as fallback destinations instead of pretending inline browsing support."
patterns-established:
  - "Browser direct entry is now governed by repo-owned normalization and truthfulness rules instead of component-only ad hoc parsing."
requirements-completed: [BROW-05, BROW-06]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 17-2026-04-11T18-37-19
generated_at: 2026-04-11T18:41:34Z
duration: 17min
completed: 2026-04-11
---

# Phase 17 Plan 01 Summary

**Browser now has a deterministic direct-navigation model that normalizes typed addresses and keeps external fallback honest**

## Accomplishments

- Added direct-navigation helpers that normalize bare domains, resolve same-origin local paths, reject unsupported protocols, and classify destinations as inline or fallback.
- Reused curated destinations when a typed URL resolves to one that already exists, so the Browser can preserve known safe/fallback examples.
- Added focused unit coverage around same-origin direct paths, normalized remote URLs, curated-destination matches, and unsupported protocols.

## Verification

- `bun run test -- src/features/apps/browser/browserDestinations.test.ts`
- `bun x tsc --noEmit`
- `bun run build`

## Notes

- The navigation model stays intentionally explicit about what can render inline: same-origin paths only in this phase.
