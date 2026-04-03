# Phase 2: Adaptive Shell Foundation - Research

**Researched:** 2026-04-03
**Domain:** responsive portrait iPhone shell layout, safe-area-aware chrome, and ambient wallpaper motion
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use a hybrid sizing model: a small set of portrait iPhone layout profiles with light interpolation inside each profile.
- Treat safe areas and notch/home-indicator space as first-class layout inputs everywhere.
- Optimize for cross-device illusion over exact single-device pixel matching.
- On unusual portrait aspect ratios, compress spacing first, then adjust icon size slightly, and only reduce row density as a last resort.
- Use a high-fidelity but not literal iPhone-like status bar.
- Show the familiar essentials only: time, signal/Wi-Fi style indicators, and battery indicator.
- Treat the status bar as part of the shell and integrate it visually with wallpaper and safe-area layout.
- Keep the status bar mostly presentational in this phase rather than dynamic.
- Use a classic iPhone-style app grid with fixed columns and stable row rhythm, not a loose responsive gallery.
- Keep icon labels always visible, centered, and restrained.
- Prioritize consistent rhythm over maximizing icon count.
- Treat the dock as a distinct material layer with its own spacing and safe-area-aware placement.
- Keep this phase focused on static shell composition only: grid, labels, dock, wallpaper relationship, status-bar alignment, and responsive spacing rules.
- Use an original wallpaper and shell tone that feels premium, luminous, and iPhone-like without deriving from Apple artwork.
- Use restrained glass/frosted materials for shell surfaces such as the dock.
- Lean toward cool, cinematic tones that preserve strong icon and label legibility.
- The shell should feel like a believable operating-system surface, not a one-off landing page aesthetic.
- Phase 2 should ship one default animated ambient background.
- That background should feel slow, fluid, drifting, and nebula-like with no sharp pulses or obvious loops.
- Animation should stay subtle and continuous, with no device-motion parallax or touch-driven interaction in this phase.
- Respect reduced-motion preferences.

### Claude's Discretion
- Exact profile breakpoints and interpolation values for the hybrid layout model.
- Exact icon, label, dock, and spacing measurements within the approved adaptation rules.
- Exact visual styling of the non-literal status indicators.
- Exact implementation technique for the animated background, as long as the motion stays subtle and performant.
- Exact default palette choice for the first animated background.

### Deferred Ideas (OUT OF SCOPE)
- User-selectable ambient background presets.
- User-customizable background palette derived from a chosen anchor color.
- Multiple animated ambient backgrounds active in the product at once.
</user_constraints>

<research_summary>
## Summary

Phase 2 should be implemented as a shell scene driven by pure profile derivation and CSS-variable output, not a pile of device-specific pixel constants. MDN’s current guidance on dynamic viewport units and safe-area environment variables supports a robust web shell approach: compute a small set of profile kinds from viewport width, height, aspect ratio, and safe-area insets, then publish those values as shell tokens for the status bar, icon grid, labels, dock, and wallpaper layers.

For the status bar edge case, Apple’s standalone-web-app guidance is explicit that even in standalone mode a status bar still appears, and the `apple-mobile-web-app-status-bar-style` meta tag only changes its appearance. That means the safest Phase 2 approach is to reserve top safe-area space and render the custom status row beneath that reserved region instead of trying to draw custom icons directly into the native bar’s territory before real-device validation. The exact clash behavior remains a research flag for implementation-time testing on iPhone.

For the ambient wallpaper, the best fit for this phase is a CSS-first implementation: layered gradient fields or blurred blobs rendered in their own background component, animated with slow transform/opacity motion, and reduced or replaced when `prefers-reduced-motion` indicates the user wants less motion. No extra animation library is needed yet.

**Primary recommendation:** Build Phase 2 around a pure `ShellProfile` model plus CSS-variable shell tokens, reserve the native status-bar region instead of competing with it, and implement the first ambient wallpaper as a CSS-driven slow-motion background that respects reduced-motion preferences.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Shell scene composition and component boundaries | Existing app foundation already uses React; this phase needs component isolation more than new framework surface. |
| TypeScript | 6.0.2 | Typed shell-profile derivation and theme configuration | Helps keep profile kinds, token outputs, and theme palettes explicit and testable. |
| CSS environment and viewport primitives | Platform standard | Safe areas, viewport-derived sizing, and display-mode-aware layout | MDN documents `env(safe-area-inset-*)`, `svh/lvh/dvh`, and media queries as the right tools for shell geometry. |
| Web App standalone metadata | Platform standard | Standalone-only presentation assumptions and status-bar behavior | Apple’s standalone web-app model defines the upper boundary conditions for this shell. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.2 | Unit tests for pure shell-profile and motion-preference logic | Use for profile derivation and ambient-motion fallback logic. |
| `VisualViewport` | Platform standard | Future-proof measurement for visible viewport behavior | Useful for shell measurement hooks and later keyboard-aware behavior, but do not overuse it where `dvh`/safe-area tokens already solve the problem. |
| `prefers-reduced-motion` | Platform standard | Motion accessibility | Use immediately for the animated ambient background. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS-variable shell tokens from a profile model | Hard-coded per-device layout maps | Hard-coded maps may look great on one phone but are brittle and expensive to maintain across the portrait iPhone range. |
| CSS/React-based ambient background | Canvas/WebGL background renderer | Canvas/WebGL gives more visual control later, but adds complexity, accessibility risk, and harder motion fallback in this phase. |
| Reserved native status-bar region | Drawing fully custom chrome flush into the topmost safe area | More aggressive illusion on some devices, but higher risk of conflict with the real standalone status bar. |

**Installation:**
```bash
# No new packages required by default for this phase
pnpm test
pnpm build
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
src/
├── features/shell/
│   ├── AdaptiveShellFoundation.tsx
│   ├── components/
│   │   ├── StatusBar.tsx
│   │   ├── HomeScreenGrid.tsx
│   │   ├── Dock.tsx
│   │   └── AmbientBackground.tsx
│   ├── data/
│   │   └── homeScreenIcons.ts
│   ├── profile/
│   │   ├── createShellProfile.ts
│   │   ├── createShellProfile.test.ts
│   │   └── useShellViewport.ts
│   └── theme/
│       ├── ambientPalette.ts
│       ├── resolveAmbientMotion.ts
│       ├── resolveAmbientMotion.test.ts
│       └── shellTheme.css
```

### Pattern 1: Pure shell-profile derivation
**What:** Convert viewport width, height, aspect ratio, and safe-area values into a typed shell profile that becomes the source of truth for layout tokens.
**When to use:** Immediately, before grid and dock composition.
**Example:**
```typescript
type ShellProfile = {
  kind: "compact" | "balanced" | "expanded";
  iconSize: number;
  gridGap: number;
  dockBottomInset: number;
};
```

### Pattern 2: CSS-variable bridge from profile to scene
**What:** Derive shell tokens in TypeScript, then expose them as CSS variables at the shell-root level.
**When to use:** For icon spacing, row rhythm, dock placement, and status-bar offsets.
**Example:**
```typescript
const style = {
  "--shell-icon-size": `${profile.iconSize}px`,
  "--shell-grid-gap": `${profile.gridGap}px`,
};
```

### Pattern 3: Background layer separated from shell chrome
**What:** Render the ambient wallpaper in its own component/layer behind the status bar, icon grid, and dock.
**When to use:** To keep motion styling independent from shell composition and avoid CSS overlap between the layout and background tracks.
**Example:**
```tsx
<div className="shell-scene">
  <AmbientBackground />
  <StatusBar />
  <HomeScreenGrid />
  <Dock />
</div>
```

### Anti-Patterns to Avoid
- **One-device screenshot tuning:** do not encode shell geometry as fixed numbers optimized around a single phone.
- **Status bar chrome inside the unsafe area:** until on-device research proves it safe, reserve native bar space instead of competing with it.
- **Generic card UI:** the home screen should feel like an operating-system surface, not a SaaS dashboard.
- **Busy animated wallpaper:** the background should support the shell, not compete with icons, labels, and dock hierarchy.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Safe-area math from guessed device models | Manual per-device notch tables | `env(safe-area-inset-*)` plus a typed profile layer | Platform values already reflect the visible safe region. |
| “Full height” shell sizing with plain `vh` only | Relying exclusively on `100vh` | `svh`/`dvh`-aware sizing strategy | MDN documents `vh` as equivalent to `lvh`, which can drift from the actually visible viewport. |
| Advanced graphics engine for ambient motion | Canvas/WebGL scene system | Layered CSS gradients, filters, and transforms | This phase only needs subtle ambient motion and reduced-motion compliance. |

**Key insight:** Spend Phase 2 effort on shell geometry and compositional fidelity, not on inventing lower-level graphics or device-detection systems the platform already partially solves.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Status bar collision with native standalone chrome
**What goes wrong:** The custom top row fights the native standalone status region and immediately breaks the illusion.
**Why it happens:** The implementation assumes standalone mode removes all top chrome.
**How to avoid:** Reserve top safe-area space and render the custom status row below it until real-device verification proves a more aggressive approach is safe.
**Warning signs:** Time/icons appear too high, clipped, or duplicated on device.

### Pitfall 2: Profile system that is actually just a pile of breakpoints
**What goes wrong:** The layout still feels brittle because the “profiles” are just scattered media-query constants.
**Why it happens:** The app lacks a single derived shell-profile model.
**How to avoid:** Centralize profile derivation in one pure module and publish tokens from there.
**Warning signs:** Grid, labels, dock, and status bar all use separate breakpoint logic.

### Pitfall 3: Ambient background overpowering the shell
**What goes wrong:** The wallpaper becomes the star and the app grid loses clarity.
**Why it happens:** Motion, blur, or saturation is pushed too far because the background looks exciting in isolation.
**How to avoid:** Treat the background as atmosphere only, keep icon/label contrast dominant, and reduce motion or intensity behind content regions.
**Warning signs:** Labels become harder to read or the dock stops feeling grounded.

### Pitfall 4: Reduced-motion support added as a late afterthought
**What goes wrong:** The shell ships with motion-heavy behavior that later becomes awkward to tone down.
**Why it happens:** Motion is implemented directly in many selectors instead of through one reducible strategy.
**How to avoid:** Add a dedicated motion-resolution helper and a reduced-motion path from the start.
**Warning signs:** No single place defines whether the ambient background should animate, soften, or stop.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Safe-area-aware padding
```css
.shell-root {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
```

### Standalone-only styling branch
```css
@media (display-mode: standalone) {
  .shell-root {
    min-height: 100dvh;
  }
}
```

### Reduced-motion ambient fallback
```css
@media (prefers-reduced-motion: reduce) {
  .ambient-background__layer {
    animation: none;
  }
}
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Using `vh` as the one true viewport height | Prefer `svh`/`dvh`-aware sizing when the visible viewport matters | Modern viewport-units guidance | Shell height should not rely on `vh` alone in mobile standalone contexts. |
| Treating safe-area handling as mostly top-padding hacks | Use `env(safe-area-inset-*)` as a first-class layout input | Current MDN and Apple guidance | Safe-area values belong in the shell profile and token output. |
| Motion added without accessibility branch | Build `prefers-reduced-motion` into the design from the start | Current accessibility baseline | Ambient wallpaper must reduce or stop motion when requested. |

**New tools/patterns to consider:**
- Dynamic viewport units (`dvh`, `svh`) for shell-height behavior.
- `display-mode` media queries for standalone-specific layout branches.
- `backdrop-filter` for restrained dock material, used sparingly.

**Deprecated/outdated:**
- Pure `vh` sizing for mobile shells that need visible-viewport fidelity.
- Treating the native standalone status region as if it always disappears.
</sota_updates>

<open_questions>
## Open Questions

1. **How much of the custom status bar can safely approach the native standalone status region on real iPhones?**
   - What we know: Apple says standalone mode still shows a status bar, and the status-bar-style meta tag changes its appearance.
   - What's unclear: how aggressively the custom shell can visually align with that region without obvious clash on current iPhones.
   - Recommendation: plan Phase 2 with reserved top safe-area space and include real-device verification before tightening the top chrome.

2. **Is CSS-only ambient motion enough for the desired liquid/nebula feel?**
   - What we know: layered gradients, filters, and slow transforms are sufficient for a subtle atmospheric background.
   - What's unclear: whether the eventual aesthetic target will later justify a more advanced renderer.
   - Recommendation: stay CSS-first in Phase 2 and reassess only if the result is clearly inadequate.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Apple Safari Web Content Guide: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) - standalone mode, Apple touch icons, and status-bar appearance constraints
- [MDN: `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env) - safe-area inset behavior
- [MDN: `display-mode` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode) - standalone-specific CSS branching
- [MDN: `VisualViewport`](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport) - layout vs visual viewport behavior
- [MDN: `<length>` viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length) - `svh`, `lvh`, and `dvh`
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - motion accessibility behavior
- [MDN: Using filter effects](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Filter_effects/Using) - `filter` and `backdrop-filter` capabilities

### Secondary (MEDIUM confidence)
- [Phase 2 context](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/02-adaptive-shell-foundation/02-CONTEXT.md) - locked user decisions for this phase
- [Project research summary](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/SUMMARY.md) - prior project-level ordering and shell guidance
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: safe-area-aware responsive shell layout
- Ecosystem: web-platform viewport and motion primitives
- Patterns: profile derivation, CSS-variable shell tokens, ambient background layering
- Pitfalls: status-bar clash, one-device tuning, motion overpowering the shell

**Confidence breakdown:**
- Standard stack: HIGH - no new library uncertainty required for this phase
- Architecture: HIGH - directly aligned with current codebase and locked context
- Pitfalls: HIGH - driven by official platform behavior and user concerns
- Code examples: HIGH - based on current official platform primitives

**Research date:** 2026-04-03
**Valid until:** 2026-05-03
</metadata>

---
*Phase: 02-adaptive-shell-foundation*
*Research completed: 2026-04-03*
*Ready for planning: yes*
