---
phase: 07-real-installed-boundary-verification
status: pending-human-run
purpose: literal installed-web-app boundary confirmation
updated: 2026-04-04T20:35:00Z
---

# Phase 7 Installed-Boundary UAT

## Why This Exists

Phase 7 removed the dev-only standalone query override from browser automation and replaced it with a production-like `display-mode` harness. That closes the original audit problem around `dev-override`, but Playwright WebKit still does not constitute literal proof of launching the app from an iPhone Home Screen as an installed web app.

This checklist captures the remaining manual confirmation needed if the milestone audit still requires true installed-container evidence.

## Manual Check

### Preconditions

- Use an actual iPhone in Safari, or another environment that can truthfully reproduce the installed web-app container.
- Start from a normal browser visit to the production-like app URL.

### Steps

1. Open the site in Safari browser mode.
2. Confirm the install-first onboarding shell is shown.
3. Add the app to the Home Screen using Safari’s install flow.
4. Launch the app from the Home Screen, not from the browser tab.
5. Confirm the app enters the standalone launch path instead of the browser onboarding shell.
6. Wait for the short launch intro to finish.
7. Confirm the adaptive home screen is visible.
8. Open Calculator and return home with the Home pill.

### Expected Results

- Browser mode shows onboarding/install guidance.
- Home Screen launch does not show browser onboarding.
- Installed launch shows the standalone intro then the adaptive home screen.
- Calculator still opens and returns home correctly from that installed entry path.

## Result

- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

## Evidence

- Environment:
- URL tested:
- Result:
- Notes:
