# Phase 1: Installable Web App Entry - Research

**Researched:** 2026-03-31
**Domain:** installed iPhone web-app entry flow, standalone detection, and pre-install onboarding
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Non-standalone Safari visits should see a full-screen install-first onboarding experience rather than a slim banner.
- The real product should peek through beneath or behind the onboarding so users can understand what they are installing.
- Install guidance should be literal and Safari-specific, using the actual flow: Share -> Add to Home Screen -> Open as Web App -> Add.
- If users dismiss onboarding, the full takeover should stay suppressed for a limited time and a smaller persistent install prompt should remain visible.
- Before install, users may see a limited live preview of the home screen.
- Pre-install interaction should be intentionally limited; meaningful product use should not happen in browser mode.
- If users tap an app before installing, show a polished intercept that redirects them toward installing openOS instead of opening the real app.
- Browser mode should look close to the installed experience, but it may include subtle preview-mode treatment where needed to explain why install is recommended.
- The installed app name should be `openOS`.
- The Home Screen icon should feel plausible inside an iPhone grid, but it must be original and avoid Apple-derived marks.
- First launch should include a very short polished launch state that feels app-like, not a long boot animation.
- Branding inside the installed app should stay restrained so the illusion remains strong.
- First installed launch should move quickly from the short launch state into the home screen.
- Returning installed launches should go straight back into the product without repeating a tutorial or intro sequence.
- Browser-mode onboarding dismissal should be remembered for a limited period.
- If returning browser-mode users try to interact again, the stronger install prompt can reappear when they tap into deeper product paths.

### Claude's Discretion
- Exact copywriting for onboarding, intercepts, and the smaller persistent install prompt.
- Exact duration and visual treatment of the short launch state.
- Exact styling of preview-mode hints as long as they remain subtle.
- Exact storage duration for remembered onboarding dismissal, as long as it is temporary rather than permanent.

### Deferred Ideas (OUT OF SCOPE)
- If historical context is useful later, add a short docs note that the project was previously named `iCeption`, which combined `iPhone` and `Inception`.

</user_constraints>

<research_summary>
## Summary

Phase 1 should use a straightforward client-rendered web-app bootstrap with explicit installed-mode detection and explicit Safari instructions rather than trying to “discover” an iOS install prompt API. Apple’s current iPhone user flow makes the install path manual and user-driven, which means the product should guide users through that flow directly instead of relying on browser install events that are not the primary iPhone experience.

The cleanest implementation path is: bootstrap a Vite + React + TypeScript app, normalize install context from `display-mode` plus legacy iOS standalone signals, branch between browser-mode onboarding and standalone entry, and wire a hand-authored manifest plus Apple web-app meta tags in `index.html`. Service worker behavior can stay minimal or deferred for this phase; the important thing now is reliable install identity, explicit mode detection, and a browser-mode experience that strongly funnels users into standalone mode.

**Primary recommendation:** Build Phase 1 around explicit standalone detection, a full-screen Safari-specific onboarding flow, and a manually controlled manifest/index metadata setup rather than relying on a higher-level PWA abstraction first.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Browser-mode and standalone-mode entry surfaces | Flexible component boundaries for install flow, preview shell, and launch state |
| TypeScript | 6.0.2 | Typed install context, prompt state, and entry-state models | Keeps browser/standalone states explicit and harder to misuse |
| Vite | 8.0.3 | Fast local/dev build loop | Good default for a greenfield client app without SSR needs |
| Web App Manifest + Apple web-app meta tags | Platform standard | Installed identity, app naming, standalone behavior, and iPhone metadata | This phase is fundamentally about install identity and entry mode |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@vitejs/plugin-react` | 6.0.1 | React integration for Vite | Use by default in the initial scaffold |
| Vitest | 4.1.2 | Unit tests for pure install-context and prompt-state logic | Use immediately for browser/standalone branching rules and dismissal TTL logic |
| `vite-plugin-pwa` | 1.2.0 | Optional manifest/service-worker helper | Use only if the manual manifest/index setup starts becoming repetitive; Phase 1 does not need it to succeed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-authored manifest + Apple tags | `vite-plugin-pwa` | Plugin convenience is nice, but manual control is clearer while Phase 1 is learning iPhone-specific edge cases |
| `display-mode` + `navigator.standalone` normalization | Heavy user-agent parsing | UA parsing adds brittleness and does not reflect the actual runtime mode as reliably |
| Persistent onboarding banner | Full-screen takeover | Banner is easier to ship but too weak for a phase whose whole goal is install conversion |

**Installation:**
```bash
pnpm add react react-dom
pnpm add -D typescript vite @vitejs/plugin-react vitest @types/react @types/react-dom
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
src/
├── app/                         # bootstrap, app root, environment wiring
├── features/install/browser/    # onboarding, preview mode, persistent prompt
├── features/install/standalone/ # launch state and installed entry behavior
├── lib/platform/                # display-mode and standalone detection
└── lib/storage/                 # small persistence helpers for dismissal memory
```

### Pattern 1: Normalized install-context adapter
**What:** Read browser/runtime signals once, then expose a typed `installContext` to the UI.
**When to use:** Immediately, so browser mode and standalone mode do not get inferred ad hoc from components.
**Example:**
```typescript
export type InstallContext =
  | { kind: "browser" }
  | { kind: "standalone" };

export function detectInstallContext(win: Window): InstallContext {
  const isStandaloneDisplay = win.matchMedia("(display-mode: standalone)").matches;
  const isLegacyStandalone = "standalone" in win.navigator && Boolean((win.navigator as Navigator & { standalone?: boolean }).standalone);

  return isStandaloneDisplay || isLegacyStandalone
    ? { kind: "standalone" }
    : { kind: "browser" };
}
```

### Pattern 2: Prompt-state logic as a pure function
**What:** Keep “show takeover vs show smaller prompt vs re-escalate” as pure logic fed by persisted timestamps and user actions.
**When to use:** For dismissal TTLs and deeper-interaction escalation behavior.
**Example:**
```typescript
export function shouldShowTakeover(now: number, maybeDismissedAt: number | null, ttlMs: number): boolean {
  if (maybeDismissedAt === null) {
    return true;
  }

  return now - maybeDismissedAt >= ttlMs;
}
```

### Pattern 3: Separate browser and standalone entry surfaces
**What:** Give browser mode and installed mode different top-level surfaces with shared styling tokens rather than one overloaded component.
**When to use:** When the preview/install flow should feel close to the real product but still be intentionally constrained.
**Example:**
```typescript
function AppRoot({ context }: { context: InstallContext }) {
  if (context.kind === "standalone") {
    return <StandaloneEntry />;
  }

  return <BrowserInstallFlow />;
}
```

### Anti-Patterns to Avoid
- **Relying on `beforeinstallprompt` as the main path:** iPhone install guidance is manual and Safari-specific, so phase behavior should not depend on a generic install event.
- **Scattering mode detection across components:** makes browser/standalone behavior inconsistent and hard to test.
- **Building Phase 2 shell fidelity into Phase 1:** this phase needs a convincing preview, not the full home-screen layout system.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Installed-mode detection | Deep custom UA/device parser | `matchMedia("(display-mode: standalone)")` plus `navigator.standalone` fallback | Runtime mode matters more than guessed device/browser identity |
| Build/dev setup | Custom bundler/toolchain scripts | Vite scaffold | Faster path to shipping Phase 1 behavior |
| Complex persistence layer for dismissal memory | IndexedDB wrapper or backend persistence | Local storage with a timestamped TTL helper | The data is tiny and local to the entry flow |

**Key insight:** This phase should hand-roll product behavior, not platform plumbing that already has simpler primitives.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Assuming browser mode is “close enough”
**What goes wrong:** Users stay in Safari, see browser chrome, and never experience the intended product surface.
**Why it happens:** The app tries to be too usable before install.
**How to avoid:** Make browser mode a guided install funnel with only a limited preview.
**Warning signs:** Browser mode grows real features instead of routing users toward install.

### Pitfall 2: Treating install context as user-agent detection
**What goes wrong:** Mode detection becomes brittle and fails in testing or on iPhone edge cases.
**Why it happens:** Developers guess from browser strings instead of actual display/runtime signals.
**How to avoid:** Normalize install context from `display-mode` and legacy standalone flags in one adapter.
**Warning signs:** Components ask for user agent strings or browser-name conditionals.

### Pitfall 3: Overbuilding the Phase 1 shell
**What goes wrong:** Phase 1 balloons into Phase 2 home-screen work and loses momentum.
**Why it happens:** The preview shell becomes an excuse to implement the full product early.
**How to avoid:** Keep the preview intentionally shallow and reserve full home-screen fidelity for the next phase.
**Warning signs:** Grid-density, status-bar polish, or dock mechanics start dominating this phase.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Manifest display and orientation
```json
{
  "name": "openOS",
  "short_name": "openOS",
  "display": "standalone",
  "orientation": "portrait"
}
```

### Apple web-app metadata in `index.html`
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/icons/openos-icon-180.png" />
```

### Standalone detection branch
```typescript
const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Treating iPhone install as only “Add to Home Screen” | Apple now exposes “Open as Web App” in the current flow | Current iPhone user guidance | Install instructions should mention the modern web-app path explicitly |
| Treating manifest support as optional polish | Modern installed-web-app identity uses manifest/display/orientation metadata more directly | Current PWA/browser practice | Phase 1 should wire manifest metadata early |
| Guessing runtime from device/browser heuristics | Use actual display-mode and viewport/runtime APIs | Current MDN/browser guidance | Better branching and easier testing |

**New tools/patterns to consider:**
- `display-mode` media queries for mode-specific styling and branching
- `VisualViewport` later, when keyboard/viewport behavior becomes part of app-level UX

**Deprecated/outdated:**
- Heavy UA parsing for install context
- Banking the phase on generic install-prompt events instead of explicit iPhone guidance
</sota_updates>

<open_questions>
## Open Questions

1. **Should Phase 1 include a service worker at all?**
   - What we know: install identity and standalone entry do not require deep offline caching yet.
   - What's unclear: whether a minimal service worker adds enough value now to justify the extra surface.
   - Recommendation: keep service-worker behavior minimal or defer it unless the scaffold strongly benefits from it.

2. **How polished should the original icon asset be in this phase?**
   - What we know: the icon must be original and plausible in the iPhone grid.
   - What's unclear: whether to invest in a production-quality icon immediately or use a solid original placeholder asset first.
   - Recommendation: ship a clean original placeholder asset now if needed, as long as the manifest/apple-touch-icon wiring is correct.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Apple Support: Turn a website into an app in Safari on iPhone](https://support.apple.com/en-bw/guide/iphone/iphea86e5236/26/ios/26) - current user-facing install flow including “Open as Web App”
- [Apple Safari Web Content Guide: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) - Apple web-app metadata, touch icon, and standalone behavior
- [MDN: `display` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display) - installed display semantics
- [MDN: `orientation` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/orientation) - portrait orientation behavior
- [MDN: `display-mode` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode) - runtime display-mode detection

### Secondary (MEDIUM confidence)
- [Project research summary](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/SUMMARY.md) - phase-order and platform recommendations already synthesized for this repo
- [Stack research](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/STACK.md) - current package versions and stack choices

</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: installed web-app entry and standalone detection
- Ecosystem: Vite, React, TypeScript, manifest/meta setup
- Patterns: onboarding gating, install-context normalization, dismissal memory
- Pitfalls: browser/install-mode confusion, overbuilding the phase, brittle detection

**Confidence breakdown:**
- Standard stack: HIGH - existing project stack research already verified current versions
- Architecture: HIGH - straightforward phase-specific split from context and official docs
- Pitfalls: HIGH - directly aligned with the product boundary and platform behavior
- Code examples: MEDIUM - authored from official platform primitives rather than copied verbatim from docs

**Research date:** 2026-03-31
**Valid until:** 2026-04-30
</metadata>

---
*Phase: 01-installable-web-app-entry*
*Research completed: 2026-03-31*
*Ready for planning: yes*
