# Phase 4: Motion and App Navigation - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Add the app open/close motion system and the custom Home-button return flow so app navigation feels like part of the OS illusion. This phase covers app-launch transitions from the tapped icon, app-dismiss transitions back to the home screen, the custom bottom-center Home control, and reduced-motion navigation behavior. It does not add new app capabilities, richer gesture systems, or app-specific transition exceptions.

</domain>

<decisions>
## Implementation Decisions

### App opening motion
- Use a near-literal iOS-style zoom-open transition rather than a stylized custom animation.
- The transition should start from the tapped icon’s position and scale into the full-screen app surface.
- Keep the timing fast and calm, roughly `220–260ms` on open and slightly quicker on close.
- The existing pressed-state feedback should remain and hand off immediately into the open transition.

### Home-button behavior
- Use a small centered pill above the bottom safe area, not a large or loud button.
- Show the Home button only while an app is open.
- Keep it visually restrained and glass-like: clearly tappable but secondary to app content.
- Tapping it should reverse the app-open transition back to the home screen rather than hard-cutting away.

### Motion consistency rules
- Use one shared outer container transition system for Calculator and `Coming Soon` apps.
- The outer open/close motion should be identical regardless of app type.
- Any differences between app types should stay inside the app content after the container opens, not in the launcher transition itself.
- Do not add app-specific transition exceptions in this phase.

### Reduced-motion behavior
- Respect `prefers-reduced-motion` automatically.
- Replace the zooming transition with a very short fade or minimal opacity/scale shift.
- Keep navigation behavior identical; only simplify the visual travel.
- The Home button should still appear and disappear, but without noticeable flourish.

### Claude's Discretion
- Exact easing curves within the approved near-literal iOS direction.
- Exact timing split between pressed-state handoff and container transition.
- Exact styling of the Home pill as long as it stays restrained and centered.
- Exact reduced-motion fallback values as long as the result is clearly gentler than the default path.

</decisions>

<specifics>
## Specific Ideas

- The motion should feel like the shell itself is opening an app, not like generic website navigation.
- The Home button should feel like a deliberate workaround for the web environment, but visually calm enough not to break the illusion.
- The reverse-to-home close motion is as important as the open motion; both should feel like one system.

</specifics>

<deferred>
## Deferred Ideas

- Gesture-driven home swipe or edge-swipe navigation.
- App-specific transition styles.
- Long-press, edit mode, or other secondary shell interactions.
- Any richer motion choreography inside apps beyond the shared container transition.

</deferred>

---
*Phase: 04-motion-and-app-navigation*
*Context gathered: 2026-04-04*
