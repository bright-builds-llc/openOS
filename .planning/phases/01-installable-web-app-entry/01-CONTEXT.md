# Phase 1: Installable Web App Entry - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Guide users from Safari into the intended installed standalone iPhone web-app experience. This phase covers browser-mode onboarding, install guidance, installed app identity, and first-run/repeat entry behavior. It does not add later shell capabilities, more apps, or broader iOS system surfaces.

</domain>

<decisions>
## Implementation Decisions

### Browser onboarding
- Non-standalone Safari visits should see a full-screen install-first onboarding experience rather than a slim banner.
- The real product should peek through beneath or behind the onboarding so users can understand what they are installing.
- Install guidance should be literal and Safari-specific, using the actual flow: Share -> Add to Home Screen -> Open as Web App -> Add.
- If users dismiss onboarding, the full takeover should stay suppressed for a limited time and a smaller persistent install prompt should remain visible.

### Pre-install experience
- Before install, users may see a limited live preview of the home screen.
- Pre-install interaction should be intentionally limited; meaningful product use should not happen in browser mode.
- If users tap an app before installing, show a polished intercept that redirects them toward installing openOS instead of opening the real app.
- Browser mode should look close to the installed experience, but it may include subtle preview-mode treatment where needed to explain why install is recommended.

### Installed app identity
- The installed app name should be `openOS`.
- The Home Screen icon should feel plausible inside an iPhone grid, but it must be original and avoid Apple-derived marks.
- First launch should include a very short polished launch state that feels app-like, not a long boot animation.
- Branding inside the installed app should stay restrained so the illusion remains strong.

### First-run and repeat entry
- First installed launch should move quickly from the short launch state into the home screen.
- Returning installed launches should go straight back into the product without repeating a tutorial or intro sequence.
- Browser-mode onboarding dismissal should be remembered for a limited period.
- If returning browser-mode users try to interact again, the stronger install prompt can reappear when they tap into deeper product paths.

### Claude's Discretion
- Exact copywriting for onboarding, intercepts, and the smaller persistent install prompt.
- Exact duration and visual treatment of the short launch state.
- Exact styling of preview-mode hints as long as they remain subtle.
- Exact storage duration for remembered onboarding dismissal, as long as it is temporary rather than permanent.

</decisions>

<specifics>
## Specific Ideas

- The product should feel nearly indistinguishable from interacting with an iPhone once installed.
- The install-first browser experience should still let users glimpse the home-screen illusion instead of presenting a generic marketing wall.
- The installed icon should look at home in an iPhone app grid while remaining clearly original.

</specifics>

<deferred>
## Deferred Ideas

- If historical context is useful later, add a short docs note that the project was previously named `iCeption`, which combined `iPhone` and `Inception`.

</deferred>

---
*Phase: 01-installable-web-app-entry*
*Context gathered: 2026-03-31*
