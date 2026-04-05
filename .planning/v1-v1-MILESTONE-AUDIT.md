---
milestone: v1
audited: 2026-04-04T10:06:35Z
status: gaps_found
scores:
  requirements: 20/20
  phases: 6/6
  integration: 5/6
  flows: 4/5
gaps:
  requirements: []
  integration:
    - "Phase 7 replaced the dev-only standalone query override with a production-like `display-mode` browser harness, but literal Home Screen installed-app proof still depends on the pending manual UAT artifact."
  flows:
    - "The browser suite now proves production-like `display-mode` entry, but the literal Home Screen installed launch still awaits manual UAT confirmation."
tech_debt:
  - phase: milestone-docs
    items:
      - "PROJECT.md still reflects the pre-closeout state (`Validated: None yet`, active checkboxes unchecked, key-decision outcomes still marked `Pending`). This does not block milestone completion and should be normalized during milestone archive/closeout."
  - phase: phase-1-preview
    items:
      - "PreviewShell.tsx hardcodes preview icons instead of deriving from the runtime app registry, so the pre-install preview can drift from the real launcher."
      - "Browser install CTAs in BrowserInstallOverlay.tsx and AppTapIntercept.tsx are presentational only and do not perform any actionable assist behavior."
---

# Milestone v1 Audit

## Verdict

openOS V1 still has one milestone-level boundary-proof gap.

All 20 V1 requirements are satisfied and the original Phase 6 dev-override gap has been narrowed. The browser suite now uses a production-like `display-mode` harness, but the milestone still lacks literal Home Screen installed-container proof until Phase 7 manual UAT is completed.

## Scorecard

| Dimension | Score | Result |
|-----------|-------|--------|
| Requirements | 20/20 | Passed |
| Phases | 6/6 | Passed |
| Integration | 5/6 | Gaps found |
| Flows | 4/5 | Gaps found |

## Requirement Coverage

| Requirement | Owning Phase | Status | Evidence |
|-------------|--------------|--------|----------|
| INST-01 | Phase 1 | Satisfied | Browser onboarding/install-first flow verified in `01-VERIFICATION.md`. |
| INST-02 | Phase 1 | Satisfied | Standalone launch path and manifest identity verified in `01-VERIFICATION.md`. |
| INST-03 | Phase 2 | Satisfied | Adaptive shell profile and portrait-safe layout verified in `02-VERIFICATION.md`. |
| HOME-01 | Phase 2 | Satisfied | Wallpaper, status bar, grid, and dock verified in `02-VERIFICATION.md`. |
| HOME-02 | Phase 2 | Satisfied | Full realistic icon grid verified in `02-VERIFICATION.md`. |
| HOME-03 | Phase 3 | Satisfied | Every visible icon launchable through runtime path in `03-VERIFICATION.md`. |
| HOME-04 | Phase 3 | Satisfied | Full-screen `Coming Soon` placeholder path verified in `03-VERIFICATION.md`. |
| RUNT-01 | Phase 3 | Satisfied | Typed app registry verified in `03-VERIFICATION.md`. |
| RUNT-02 | Phase 3 | Satisfied | Implemented and placeholder apps share the same runtime path in `03-VERIFICATION.md`. |
| RUNT-03 | Phase 3 | Satisfied | Shared shell/app-surface runtime extensibility verified in `03-VERIFICATION.md`. |
| MOTN-01 | Phase 4 | Satisfied | Icon-origin open transition verified in `04-VERIFICATION.md`. |
| MOTN-02 | Phase 4 | Satisfied | Home-pill reverse-to-home close path verified in `04-VERIFICATION.md`. |
| MOTN-03 | Phase 4 | Satisfied | Home pill appears only while app is open in `04-VERIFICATION.md`. |
| CALC-01 | Phase 5 | Satisfied | Calculator is the only implemented app and launches through runtime in `05-VERIFICATION.md`. |
| CALC-02 | Phase 5 | Satisfied | Digit/decimal/display behavior verified in `05-VERIFICATION.md`. |
| CALC-03 | Phase 5 | Satisfied | Core arithmetic behavior verified in `05-VERIFICATION.md`. |
| CALC-04 | Phase 5 | Satisfied | AC/C, sign toggle, and percent verified in `05-VERIFICATION.md`. |
| CALC-05 | Phase 5 | Satisfied | Portrait calculator fidelity verified in `05-VERIFICATION.md`. |
| QUAL-01 | Phase 6 | Satisfied | Shell-flow Playwright coverage verified in `06-VERIFICATION.md`. |
| QUAL-02 | Phase 6 | Satisfied | Calculator Playwright happy-path coverage verified in `06-VERIFICATION.md`. |

## Phase Audit

| Phase | Status | Verification | Notes |
|-------|--------|--------------|-------|
| Phase 1: Installable Web App Entry | Passed | `01-VERIFICATION.md` | No gaps, no anti-patterns, no human verification required. |
| Phase 2: Adaptive Shell Foundation | Passed | `02-VERIFICATION.md` | No gaps, no anti-patterns, no human verification required. |
| Phase 3: Home Screen Runtime | Passed | `03-VERIFICATION.md` | No gaps, no anti-patterns, no human verification required. |
| Phase 4: Motion and App Navigation | Passed | `04-VERIFICATION.md` | No gaps, no anti-patterns, no human verification required. |
| Phase 5: Calculator App Fidelity | Passed | `05-VERIFICATION.md` | No gaps, no anti-patterns, no human verification required. |
| Phase 6: Verification and Launch Polish | Passed | `06-VERIFICATION.md` | No blockers; infrastructure/test-runner issues were fixed during the phase and verified green. |

## Cross-Phase Integration

| Integration | Status | Evidence |
|-------------|--------|----------|
| Install-context detection feeds root app branching | Passed | `src/App.tsx`, `src/app/bootstrap/createAppContext.ts`, and `src/app/AppRoot.tsx` route browser vs standalone entry coherently. |
| Browser install flow stays separate from standalone shell | Passed | `src/features/install/browser/BrowserInstallFlow.tsx` and `src/features/install/standalone/StandaloneEntry.tsx` keep install-first preview and real shell entry separate. |
| Standalone entry hands off into the adaptive shell | Passed | `src/features/install/standalone/StandaloneEntry.tsx` mounts `AdaptiveShellFoundation` after the short launch intro. |
| Shell layout, runtime, and motion compose through one host path | Passed | `src/features/shell/AdaptiveShellFoundation.tsx`, `src/features/runtime/homeScreenRuntime.ts`, and `src/features/motion/MotionLayer.tsx` share one stateful app-open/app-close pipeline. |
| Calculator uses the same runtime/app-surface/motion path as all apps | Passed | `src/features/shell/AdaptiveShellFoundation.tsx`, `src/features/runtime/AppSurface.tsx`, and `src/features/apps/calculator/CalculatorApp.tsx` keep Calculator inside the shared host path. |
| Phase 7 browser tests prove the shipped install boundary end to end | Gap | The suite now uses a production-like preview server and `display-mode` harness, but literal Home Screen installed-app proof still depends on the pending manual checklist in `07-UAT.md`. |

## End-to-End Flows

| Flow | Status | Evidence |
|------|--------|----------|
| Browser visit -> install-first onboarding/preview | Passed | `BrowserInstallFlow.tsx` plus Phase 6 shell-flow Playwright scenario. |
| Standalone launch -> intro -> adaptive home screen | Gap | Automated proof now reaches the standalone branch through a production-like `display-mode` harness, but literal Home Screen launch still awaits the Phase 7 manual UAT check. |
| Home screen -> Calculator -> Home-pill dismiss -> home | Passed | `AdaptiveShellFoundation.tsx`, `MotionLayer.tsx`, and `tests/e2e/shell-flow.spec.ts`. |
| Home screen -> placeholder app launch | Passed | `AppSurface.tsx`, `ComingSoonApp.tsx`, and `tests/e2e/shell-flow.spec.ts`. |
| Calculator happy path through real launcher/runtime | Passed | `tests/e2e/calculator.spec.ts` plus Phase 5 behavior verification. |

## Critical Gaps

- Phase 7 removed the Phase 6 dev-only query override and now uses a production-like `display-mode` harness, but the milestone still needs the manual installed-web-app checklist in `07-UAT.md` to claim literal Home Screen launch proof end to end.

## Tech Debt

| Area | Severity | Note |
|------|----------|------|
| Milestone bookkeeping docs | Low | `PROJECT.md` still reflects the pre-closeout state. This is documentation cleanup for milestone archive, not a product or integration blocker. |
| Browser preview icon source | Low | `PreviewShell.tsx` hardcodes preview icons instead of reading the runtime registry, so preview and real launcher inventories can drift. |
| Browser install CTA behavior | Low | Primary “Install openOS” buttons in `BrowserInstallOverlay.tsx` and `AppTapIntercept.tsx` are presentational only. The manual instructions exist, but the CTA itself does not perform any assist action. |

## Audit Notes

- Every phase verification report is present and marked `passed`.
- No phase reported blockers, unsatisfied requirements, anti-patterns, or required human verification.
- The only execution-time issues surfaced during the milestone were fixed within their owning phases and verified green before phase completion.
- An independent integration checker confirmed the single integration gap above and also surfaced the two low-severity preview/install CTA caveats recorded in the tech-debt table.
- Phase 7 has now removed the original `dev-override` automation weakness; the remaining gap is specifically the literal installed-container proof captured by the new UAT artifact.

## Recommendation

Do not archive the milestone as fully complete yet. Finish the Phase 7 manual installed-boundary UAT and then re-run the audit.
