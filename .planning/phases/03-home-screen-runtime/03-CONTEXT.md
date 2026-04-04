# Phase 3: Home Screen Runtime - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Turn the static home screen into a real launcher with app identity, availability state, runtime placement rules, and polished placeholder-app behavior. This phase covers the app model, launchability of all visible icons, dock/main-grid runtime curation, and the full-screen "Coming Soon" app surface for unimplemented apps. It does not yet cover motion transitions, Home-button return behavior, or richer app-management features like folders, badges, or edit mode.

</domain>

<decisions>
## Implementation Decisions

### App model
- Every app should have a stable runtime identity with `id`, `label`, `icon`, `placement`, `availability`, and `launch surface`.
- For this phase, `availability` should be only `implemented` or `coming-soon`.
- Dock membership should be explicit in the app model, not inferred from layout.
- Do not add badges, notification counts, folders, categories, or other richer shell metadata in this phase.

### Placeholder app experience
- Unimplemented apps should open as a true full-screen app surface, not a modal or card.
- The placeholder surface should feel calm and polished: app name, `Coming Soon`, one short utility sentence, and an intentional empty state.
- Placeholder apps should use the same shell framing as real apps so they already feel like part of the system.
- Placeholder apps should behave like any other app surface once opened, even before motion and Home-button behavior are implemented in later phases.

### Launch interaction behavior
- Every visible icon should be launchable.
- No visible icons should have dead taps or disabled states in this phase.
- Taps should give a short pressed response first, then open immediately into either the implemented app or the placeholder app surface.
- Do not add long-press, edit mode, jiggle mode, drag-and-drop, or context menus in this phase.

### Home screen organization
- Calculator should be the only `implemented` app in Phase 3.
- Calculator should stay in the main grid, not the dock.
- The dock should be explicitly curated as `Phone`, `Browser`, `Messages`, and `Music`, even if those apps are still `coming-soon`.
- The rest of the visible home-screen apps remain `coming-soon`.
- The runtime-enabled home screen should feel intentionally composed rather than randomly filled.

### Claude's Discretion
- Exact shape of the runtime type definitions as long as the locked fields and semantics are preserved.
- Exact pressed-state visuals and timing for icon taps as long as they stay brief and immediate.
- Exact wording of the placeholder utility sentence.
- Exact visual composition of the empty state as long as it stays calm and polished.

</decisions>

<specifics>
## Specific Ideas

- Phase 3 should make the shell feel like a real launcher, not just a static wallpaper scene.
- Placeholder apps should already feel like legitimate system surfaces rather than temporary hack screens.
- The runtime should preserve the curated shell feel built in Phase 2 while making implementation state explicit.

</specifics>

<deferred>
## Deferred Ideas

- Home-button return behavior — Phase 4.
- App open/close motion transitions — Phase 4.
- Multiple implemented apps beyond Calculator — later phases.
- Badges, folders, edit mode, long-press interactions, or icon rearrangement — future phase.

</deferred>

---
*Phase: 03-home-screen-runtime*
*Context gathered: 2026-04-03*
