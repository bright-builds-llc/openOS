# Milestone v1: iPhone Web App Foundation

**Status:** ✅ SHIPPED 2026-04-05
**Phases:** 1-8
**Total Plans:** 24

## Overview

openOS v1 shipped the complete installable iPhone-inspired web app foundation: install-first Safari onboarding, a responsive home-screen shell, shared launcher/runtime/motion infrastructure, a high-fidelity Calculator, truthful installed-boundary verification, and final browser-entry cleanup.

## Archived Roadmap Snapshot

## Phase Summary

| Phase | Name | Goal | Requirements | Success Criteria |
|-------|------|------|--------------|------------------|
| 1 | Installable Web App Entry | Make the product enter through the right iPhone web-app path | INST-01, INST-02 | 4 |
| 2 | Adaptive Shell Foundation | Establish responsive portrait iPhone layout primitives and shell presentation | INST-03, HOME-01, HOME-02 | 5 |
| 3 | Home Screen Runtime | Build the launcher, app registry, and placeholder app behavior | HOME-03, HOME-04, RUNT-01, RUNT-02, RUNT-03 | 5 |
| 4 | Motion and App Navigation | Make app open/close behavior feel like part of the OS illusion | MOTN-01, MOTN-02, MOTN-03 | 4 |
| 5 | Calculator App Fidelity | Deliver the first real app with convincing behavior and presentation | CALC-01, CALC-02, CALC-03, CALC-04, CALC-05 | 5 |
| 6 | Verification and Launch Polish | Prove the core flow with browser automation and final quality passes | QUAL-01, QUAL-02 | 4 |
| 7 | Real Installed-Boundary Verification | Prove the shipped installed-PWA/display-mode entry path end to end | INST-02, QUAL-01 | 3 |
| 8 | Preview/Install UX Parity Cleanup | Align browser preview and install affordances with the real launcher | INST-01, HOME-02, HOME-03, RUNT-01 | 3 |

## Phase Details

### Phase 1: Installable Web App Entry

**Goal:** Users reach openOS through a browser-to-installed-web-app flow that clearly guides them into the intended standalone iPhone experience.

**Status:** Complete (verified 2026-03-31)

**Requirements:** INST-01, INST-02

**Why first:**
- The illusion is materially weaker in normal browser mode.
- Install flow and standalone entry are preconditions for realistic shell behavior.
- The rest of the roadmap should build against the intended runtime context, not a fallback environment.

**Success criteria:**
1. Safari browser visits detect non-standalone mode and show clear onboarding for adding the site to the Home Screen.
2. Installed launches enter the experience without normal browser chrome.
3. The app has the manifest/icon metadata needed for a recognizable installed web-app identity.
4. The product can branch its behavior based on actual runtime display mode rather than assumptions.

### Phase 2: Adaptive Shell Foundation

**Goal:** Build the portrait iPhone shell primitives that let the experience size and render convincingly across supported devices.

**Status:** Complete (verified 2026-04-03)

**Requirements:** INST-03, HOME-01, HOME-02

**Why second:**
- The home screen cannot feel authentic until shell geometry and safe-area handling are correct.
- Later phases depend on stable status-bar, dock, and icon-grid layout behavior.
- This is the right point to prevent one-device-only layout debt.

**Success criteria:**
1. The shell derives layout values from viewport and safe-area inputs rather than one hard-coded device.
2. The home screen renders a coherent wallpaper, status bar, dock, and full app grid in portrait mode.
3. Icon sizing, spacing, and dock layout remain visually consistent across multiple portrait iPhone viewport classes.
4. The shell reserves bottom-safe-area space appropriately for future open-app navigation controls.
5. The shell architecture keeps layout derivation in reusable primitives rather than scattering geometry logic across components.

### Phase 3: Home Screen Runtime

**Goal:** Introduce the app runtime, home-screen interactions, and placeholder-app behavior so the shell behaves like an extensible launcher instead of a static mock.

**Status:** Complete (verified 2026-04-04)

**Requirements:** HOME-03, HOME-04, RUNT-01, RUNT-02, RUNT-03

**Why third:**
- The runtime must exist before transition behavior or real apps can plug into it cleanly.
- Placeholder apps need the same launch path as implemented apps to preserve extensibility.
- This phase is where the project either becomes a platform foundation or collapses into a one-off demo.

**Success criteria:**
1. Every visible home-screen icon is backed by app metadata in a shared internal app model.
2. The runtime can launch both implemented and placeholder apps through the same registry-driven path.
3. Unimplemented apps open into a polished full-screen "Coming Soon" surface.
4. The home screen no longer relies on Calculator-specific routing or component-level special cases.
5. Adding another future app would require a new manifest/module entry rather than redesigning launcher infrastructure.

### Phase 4: Motion and App Navigation

**Goal:** Make the transition between home screen and app views feel intentional, reversible, and OS-like.

**Status:** Complete (verified 2026-04-04)

**Requirements:** MOTN-01, MOTN-02, MOTN-03

**Why fourth:**
- Motion depends on the runtime and shell foundation already existing.
- The custom Home control is part of the app-shell contract, not just a button dropped into Calculator.
- Explicit shell-state transitions reduce later animation bugs and test flakiness.

**Success criteria:**
1. Launching an implemented app produces a smooth transition from the tapped icon into the app shell.
2. Returning home produces a matching dismiss flow instead of an abrupt route swap.
3. The Home control appears only while an app is open and does not block critical content.
4. Motion behavior is driven by explicit shell/runtime state rather than scattered one-off effects.

### Phase 5: Calculator App Fidelity

**Goal:** Deliver the first real app and prove that the shell/runtime can host an experience that feels convincingly iPhone-like.

**Status:** Complete (verified 2026-04-04)

**Requirements:** CALC-01, CALC-02, CALC-03, CALC-04, CALC-05

**Why fifth:**
- Calculator should validate the platform foundation, not substitute for it.
- By this phase the shell, runtime, and motion system already exist, so Calculator can focus on app fidelity.
- This phase gives the first meaningful end-to-end demonstration of the product promise.

**Success criteria:**
1. Calculator launches from the home screen as a real app module through the runtime.
2. Digit entry, decimals, and running display updates behave correctly.
3. Addition, subtraction, multiplication, and division work correctly for the main happy paths.
4. Clear/all clear, sign toggle, and percent behave in a way that feels consistent with the portrait iPhone calculator.
5. The calculator layout and controls feel visually authentic within supported portrait iPhone viewports.

### Phase 6: Verification and Launch Polish

**Goal:** Lock in confidence around the illusion-critical user journey and remove obvious fidelity rough edges before expansion.

**Status:** Complete (verified 2026-04-04)

**Requirements:** QUAL-01, QUAL-02

**Why sixth:**
- Once the primary user journey exists, regression coverage becomes valuable instead of speculative.
- This phase prevents the project from degrading as more apps and platform work are added.
- It also creates a clean quality baseline before future roadmap expansion.

**Success criteria:**
1. Playwright covers the main browser/onboarding, installed home screen, implemented app launch, implemented app dismiss, and placeholder app launch flows.
2. Playwright covers a basic happy path through Calculator interactions.
3. The test suite is stable enough to be part of normal verification rather than a flaky demo aid.
4. Remaining shell and motion rough edges found during verification are tuned to meet the V1 quality bar.

### Phase 7: Real Installed-Boundary Verification

**Goal:** Prove the real installed-PWA/display-mode launch boundary end to end instead of relying on the dev-only standalone override in browser verification.

**Status:** Complete (verified 2026-04-05)

**Requirements:** INST-02, QUAL-01

**Gap Closure:** Closes the milestone audit gap where Phase 6 browser automation enters standalone through the dev-only `openos-install-context=standalone` shortcut rather than the shipped install boundary.

**Why seventh:**
- The milestone audit found this is the only blocker preventing full V1 closeout.
- The launcher/runtime path after standalone entry is already verified; the missing proof is the installed-boundary handoff itself.
- This should stay narrow and verification-focused rather than reopening unrelated product scope.

**Success criteria:**
1. Automated verification can exercise the installed/display-mode boundary without depending on the dev-only query override.
2. The suite proves browser visits stay in onboarding while installed launches enter the standalone shell path.
3. Shell-flow and Calculator browser verification remain stable on the new harness.

### Phase 8: Preview/Install UX Parity Cleanup

**Goal:** Remove the low-severity browser-entry debts surfaced by the milestone audit without broadening V1 scope.

**Status:** Complete (verified 2026-04-05)

**Requirements:** INST-01, HOME-02, HOME-03, RUNT-01

**Gap Closure:** Pays down the audit’s preview/runtime parity and browser install CTA behavior debt.

**Why eighth:**
- These issues do not block milestone closeout once Phase 7 is complete.
- They live in the same browser-entry surface, so they can be handled together in one narrow cleanup pass.
- Keeping this optional preserves a tight path to milestone archive.

**Success criteria:**
1. Preview-shell icon content derives from a shared launcher/runtime source rather than a hardcoded list.
2. Browser install CTAs perform a lightweight assist behavior instead of acting as decorative buttons.
3. Narrow verification protects preview/runtime parity and CTA behavior from regression.

## Requirement Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| INST-01 | Phase 1 | Complete |
| INST-02 | Phase 1 | Complete |
| INST-03 | Phase 2 | Complete |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 3 | Complete |
| HOME-04 | Phase 3 | Complete |
| RUNT-01 | Phase 3 | Complete |
| RUNT-02 | Phase 3 | Complete |
| RUNT-03 | Phase 3 | Complete |
| MOTN-01 | Phase 4 | Complete |
| MOTN-02 | Phase 4 | Complete |
| MOTN-03 | Phase 4 | Complete |
| CALC-01 | Phase 5 | Complete |
| CALC-02 | Phase 5 | Complete |
| CALC-03 | Phase 5 | Complete |
| CALC-04 | Phase 5 | Complete |
| CALC-05 | Phase 5 | Complete |
| QUAL-01 | Phase 6 | Complete |
| QUAL-02 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

Audit follow-up Phases 7 and 8 reinforce existing V1 requirements but do not change the original requirement ownership table above.

---
*Roadmap created: 2026-03-31*
*Roadmap approved: 2026-03-31*
*Phase 1 completed: 2026-03-31*
*Phase 2 completed: 2026-04-03*
*Phase 3 completed: 2026-04-04*
*Phase 4 completed: 2026-04-04*
*Phase 5 completed: 2026-04-04*
*Phase 6 completed: 2026-04-04*
*Phase 7 completed: 2026-04-05*
*Phase 8 completed: 2026-04-05*

## Milestone Summary

**Key accomplishments:**
- Install-first Safari onboarding and standalone Home Screen launch flow
- Adaptive portrait shell with status bar, dock, wallpaper, and full app grid
- Shared app registry, launcher runtime, placeholder surfaces, and reversible Home-pill navigation
- High-fidelity portrait Calculator integrated through the shared runtime path
- Browser verification for shell flow, Calculator, installed-boundary truthfulness, and browser-entry parity

**Issues Deferred:**
- Project-level closeout bookkeeping in `PROJECT.md` for the next milestone handoff

**Technical Debt Incurred:**
- None beyond milestone archive documentation cleanup
