# Pitfalls Research: v1.1 Core Apps & Platform Foundations

**Researched:** 2026-04-06

## Pitfall 1: Browser app promises more than the web platform can deliver

**Risk:** The Browser app is framed as a general browser even though many sites block iframe embedding via `X-Frame-Options` or CSP `frame-ancestors`.

**Warning signs:**
- requirements say “browse the web”
- no blocked-embed fallback exists
- implementation assumes iframe success is the normal case

**Prevention:**
- define Browser as limited and managed
- use curated/embed-safe destinations
- require blocked-embed fallback and external-open path in requirements

## Pitfall 2: Notes persistence is implemented with the wrong durability expectations

**Risk:** Notes are stored in a simplistic way that works for demos but becomes brittle once note count/content grows.

**Warning signs:**
- Notes state stored directly in component state or ad hoc localStorage blobs
- no local-only warning
- no clear storage boundary or namespace

**Prevention:**
- define a dedicated notes storage adapter
- prefer IndexedDB for structured note persistence
- require explicit local-only/no-sync messaging

## Pitfall 3: Multi-page home screens are bolted onto the shell instead of the runtime

**Risk:** Pages are implemented as presentation-only screens rather than real runtime placement/navigation state.

**Warning signs:**
- page state lives only in CSS/animation layer
- app registry does not know about page placement
- returning home loses page context

**Prevention:**
- extend runtime app metadata with page placement
- make “return home to same page” a requirement
- keep page indicators and navigation tied to runtime state

## Pitfall 4: Platform primitives over-abstract too early

**Risk:** The milestone spends too much time building a framework that no shipped app actually needs yet.

**Warning signs:**
- platform modules are designed for hypothetical plugins instead of Settings/Notes/Browser
- many abstractions with only one caller
- roadmap puts framework work far ahead of concrete app needs

**Prevention:**
- design primitives around the immediate three apps
- require visible payoffs in Settings and app registration
- defer public distribution/plugin surface to a later milestone

## Pitfall 5: Browser-entry polish leaks back into milestone priority

**Risk:** The team keeps polishing onboarding/install surfaces instead of building the next app/platform milestone.

**Warning signs:**
- roadmap includes more browser install work than app/platform work
- verification focus shifts away from the new apps

**Prevention:**
- treat browser entry as stable enough after v1 and Phase 8
- keep new verification focused on the new apps and page/runtime behavior
