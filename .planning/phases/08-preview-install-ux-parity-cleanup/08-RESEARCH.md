# Phase 8: Preview/Install UX Parity Cleanup - Research

**Researched:** 2026-04-05  
**Domain:** browser-entry cleanup, preview/runtime parity, and truthful install CTA assist behavior  
**Confidence:** HIGH

<user_constraints>
## User Constraints

### Locked Decisions
- Phase 8 is optional cleanup, not a milestone blocker.
- It should stay inside the browser-entry surface and must not reopen shell, motion, or Calculator scope.
- The milestone audit identified exactly three low-severity debts:
  - preview icon drift from the real launcher
  - non-actionable install CTAs in browser mode
  - documentation cleanup in `PROJECT.md`

### Scope Guardrails
- `PROJECT.md` cleanup is better handled during milestone archive than inside this product-surface phase.
- Browser install CTAs should become meaningfully assistive, not pretend they can trigger a native install flow if the platform does not expose that.
- Preview parity should come from a shared source of truth, but the preview does not need to become a full runtime clone.
</user_constraints>

<current_state>
## Current State

### Preview surface
- [`PreviewShell.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/PreviewShell.tsx) hardcodes eight preview labels and renders generic glyph blocks.
- The real launcher inventory lives in [`appRegistry.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts).
- Result: labels and app ordering can drift as the runtime evolves.

### Browser install CTA surface
- [`BrowserInstallOverlay.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/BrowserInstallOverlay.tsx) shows a primary `Install openOS` button with no action.
- [`AppTapIntercept.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/AppTapIntercept.tsx) does the same.
- [`BrowserInstallFlow.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/BrowserInstallFlow.tsx) already has meaningful state around takeover vs persistent prompt, but that state is not wired into the primary install CTA buttons.

### Existing verification
- [`shell-flow.spec.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/shell-flow.spec.ts) already covers browser-mode preview dismissal and install intercept behavior.
- No test currently asserts that preview content stays aligned with runtime app data.
- No test currently asserts that the primary browser install CTA performs an assistive action.
</current_state>

<research_summary>
## Summary

Phase 8 should do two focused things:

1. derive the preview shell from a thin shared browser-preview selector built on top of the runtime app registry
2. make the browser install CTA buttons perform a real assistive action that is truthful on iPhone/Safari

The most important planning constraint is platform truthfulness. MDN’s current PWA installation guidance notes that installation UI varies across browser/OS combinations and that on iOS the install flow comes from the browser’s menu/Add to Home Screen path. MDN also marks `beforeinstallprompt` as limited availability and not broadly supported across major browsers. That means Phase 8 should not plan around a generic `prompt()`-driven install CTA for the Safari/iPhone path.

The right UX improvement is therefore not “trigger install directly,” but “help the user perform the install flow better.” In this repo, the best assist behavior is likely one of:
- reveal or re-open the full install takeover with the Safari-specific steps
- focus and visually emphasize the steps section
- scroll or jump to the install instructions when the CTA is tapped
- optionally add a small contextual hint anchored to step 1 (`Tap Share in Safari`)

**Primary recommendation:** implement a shared `browserPreviewApps` selector derived from `appRegistry`, wire `PreviewShell` to it, and turn the install CTA buttons into one shared `onInstallAssist` action that reopens/focuses the takeover and visually emphasizes the Safari-specific install steps. Then add narrow verification for preview parity and CTA assist behavior.
</research_summary>

<platform_truth>
## Platform Truth

### What the platform supports
- MDN’s install guidance states that on iOS Safari, install happens through the Add to Home Screen flow.
- MDN marks `beforeinstallprompt` as limited availability and non-baseline, which makes it a poor foundation for an iPhone-first install CTA promise.

### Planning implication
- Phase 8 install CTAs should guide and assist; they should not claim to invoke a native or browser install prompt on iPhone Safari.
- “Assist behavior” is still worthwhile because the current buttons are decorative only.
</platform_truth>

<recommended_approach>
## Recommended Approach

### Pattern 1: shared preview selector, not hardcoded preview labels
Create a small selector or browser-only projection layer that chooses a curated subset of the runtime registry for preview mode.

Why this is better:
- keeps preview inventory aligned with the real launcher
- preserves the lighter-weight preview composition
- avoids coupling `PreviewShell` directly to all runtime details

Likely output:
- new browser preview data module
- `PreviewShell` renders from derived preview app metadata instead of inline strings

### Pattern 2: one shared install-assist callback
Define one install-assist action in `BrowserInstallFlow` and pass it into:
- `BrowserInstallOverlay`
- `AppTapIntercept`

The action should:
- ensure the install takeover is visible
- move user attention to the step list
- optionally trigger a lightweight visual emphasis so the CTA feels responsive and useful

Why this is better:
- one truth for CTA behavior
- keeps overlay/intercept consistent
- stays honest about platform constraints

### Pattern 3: narrow verification instead of broad new coverage
Protect only the new promises:
- preview content is derived from shared app data
- CTA assist reopens/emphasizes install guidance

That can be covered with a mix of:
- unit tests for the preview selector
- Playwright browser-mode assertions for CTA behavior
</recommended_approach>

<alternatives>
## Alternatives Considered

### 1. Trigger install with `beforeinstallprompt.prompt()`
Rejected as the default design.
Reason: limited availability, poor Safari/iPhone fit, and inconsistent with the repo’s iPhone-first target.

### 2. Keep the current decorative primary CTA
Rejected.
Reason: this is the exact debt item from the audit.

### 3. Replace the preview with the full runtime shell
Rejected.
Reason: too much scope for an optional cleanup phase and blurs the intentional distinction between preview mode and installed mode.

### 4. Duplicate app labels manually in a new preview constants file
Rejected.
Reason: that still permits drift; the whole point is to derive from a shared source.
</alternatives>

<pitfalls>
## Pitfalls

### Pitfall 1: over-coupling preview mode to the entire runtime
The preview should share data provenance, not become a second runtime implementation.

### Pitfall 2: claiming the CTA “installs” the app
On iPhone Safari, this would overpromise. The button should assist the user through the documented install path instead.

### Pitfall 3: testing implementation details rather than user-visible behavior
The tests should verify that preview labels match shared app data and that tapping Install makes guidance more visible/actionable, not that a specific CSS class toggled.

### Pitfall 4: mixing Phase 8 with milestone-archive docs cleanup
`PROJECT.md` cleanup is real but belongs in milestone completion, not in this browser-entry product phase.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan count
**2 or 3 plans**, sequential:

1. **Preview parity data path**
   - derive preview app content from `appRegistry` or a thin selector over it
   - add focused tests for the selector if introduced

2. **Install CTA assist behavior**
   - add one shared assist action in `BrowserInstallFlow`
   - wire it into overlay/intercept primary CTAs
   - add minimal UI state/styling needed for emphasis

3. **Verification and polish**
   - add or update browser-mode tests
   - ensure preview parity and CTA behavior are protected
   - keep any final polish tightly scoped to the browser-entry files

### Likely files
- `src/features/install/browser/PreviewShell.tsx`
- `src/features/install/browser/BrowserInstallFlow.tsx`
- `src/features/install/browser/BrowserInstallOverlay.tsx`
- `src/features/install/browser/AppTapIntercept.tsx`
- `src/features/install/browser/browserInstall.css`
- likely a new preview selector/helper file
- `tests/e2e/shell-flow.spec.ts` or a new browser-entry spec
- possibly a new small unit test around preview data derivation
</planning_implications>

<sources>
## Sources

### Primary repo sources
- [PreviewShell.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/PreviewShell.tsx)
- [BrowserInstallOverlay.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/BrowserInstallOverlay.tsx)
- [AppTapIntercept.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/AppTapIntercept.tsx)
- [BrowserInstallFlow.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/BrowserInstallFlow.tsx)
- [appRegistry.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts)
- [shell-flow.spec.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/shell-flow.spec.ts)
- [v1-v1-MILESTONE-AUDIT.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/v1-v1-MILESTONE-AUDIT.md)

### External primary sources
- [MDN: Installing and uninstalling web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing)
- [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN: Window beforeinstallprompt event](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)
</sources>
