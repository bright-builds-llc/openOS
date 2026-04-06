# Stack Research: v1.1 Core Apps & Platform Foundations

**Researched:** 2026-04-06  
**Scope:** `Settings`, `Notes`, managed-iframe `Browser`, multi-page home screens, and first app-platform primitives

## Recommendation

Keep the current stack:
- React 19
- Vite 8
- TypeScript 6
- Vitest 4
- Playwright 1.59

Add **no new framework-level dependency by default** for `v1.1`.

## Why

- The existing codebase already has the right seams: registry-driven app identity, shared app surfaces, motion/navigation state, and browser verification.
- `Settings`, `Notes`, multi-page home screens, and internal platform primitives are all application-logic problems, not missing-stack problems.
- The managed-iframe `Browser` is constrained more by web embedding policy than by missing libraries.

## Storage Recommendation

Use **IndexedDB** for Notes persistence.

Reason:
- MDN describes IndexedDB as appropriate for significant structured client-side data, while Web Storage is better suited to smaller/simple data.
- Notes need create/edit/delete/list/reopen behavior and future growth toward search/folders.
- Preferences can still live in simpler local persistence if already established, but Notes should use a dedicated persistence layer.

## Iframe / Browser Recommendation

Use the platform `iframe` element directly with a small managed wrapper.

Reason:
- The main challenge is not rendering an iframe; it is handling sites that block embedding via `X-Frame-Options` and CSP `frame-ancestors`.
- The Browser app should therefore be a limited surface for curated/embed-safe destinations, not a general browser.
- Add graceful fallback to open externally when embedding is blocked.

## Platform Primitive Recommendation

Keep platform primitives internal and typed:
- app manifest/metadata shape
- page placement and launcher model
- settings schema / app settings registration
- storage namespace conventions
- internal app management surface for Settings

No plugin runtime or public contributor workflow yet in `v1.1`.

## Avoid Adding

- No state-management framework just for this milestone
- No database library unless IndexedDB ergonomics become a real blocker
- No full routing framework
- No service-worker/offline-first rewrite
- No browser engine abstraction beyond the managed iframe wrapper

## Suggested Integration Points

- `Settings`: shared preference store + app/platform settings registry
- `Notes`: IndexedDB-backed notes repository + local-only warning banner
- `Browser`: managed iframe host + curated source list + blocked-embed fallback
- home pages: extend runtime app model with page placement and page state

## Risks

- Raw IndexedDB can be verbose; keep the storage adapter small and local to Notes.
- Browser app scope can balloon if it starts pretending to be a general browser.
- Platform primitives can over-abstract too early; keep them narrowly driven by the three target apps.
