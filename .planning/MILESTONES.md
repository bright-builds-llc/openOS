# Project Milestones: openOS

## v1.1 Core Apps & Platform Foundations (Shipped: 2026-04-09)

**Delivered:** The first believable multi-app openOS system with page-aware home screens, real `Settings` and `Notes` apps, a truthful managed-iframe `Browser`, and shared internal app-platform primitives.

**Phases completed:** 9-15 (21 plans, 62 tasks)

**Key accomplishments:**

- Multi-page home-screen launcher with active page indicators and return-home restoration
- Shared app-platform primitives for definitions, settings participation, and storage namespaces
- Real `Settings` app with persistent preferences and internal app-management surface
- Real local-only `Notes` app with browser-verified persistence and honest no-sync messaging
- Truthful managed-iframe `Browser` with curated destinations, graceful fallback, and integrated launcher-path verification
- Phase 15 cleanup that moved `Settings`, `Notes`, and `Browser` onto canonical shared runtime metadata paths

**Stats:**

- 109 files changed
- 6,538 lines of TypeScript/TSX in the current repo
- 7 phases, 21 plans, 62 tasks
- 4 days from milestone build start to ship (2026-04-06 → 2026-04-09)

**Git range:** `feat(09-01)` → `docs(v1.1): add planning and audit artifacts`

**What's next:** Define the next milestone around Notes expansion, Browser expansion, and platform distribution growth while preserving the current truthfulness and launcher-quality bar.

---

## v1 iPhone Web App Foundation (Shipped: 2026-04-05)

**Delivered:** An installable iPhone-inspired web app with adaptive home screen, shared launcher/runtime/motion system, a high-fidelity Calculator, and browser verification that now includes truthful installed-boundary and browser-entry coverage.

**Phases completed:** 1-8 (24 plans total)

**Key accomplishments:**

- Install-first Safari onboarding and standalone Home Screen entry for the intended fullscreen experience
- Adaptive portrait iPhone shell with status bar, wallpaper, dock, full app grid, and reduced-motion handling
- Shared app registry, launcher runtime, placeholder app surfaces, and reversible motion/Home-pill navigation
- High-fidelity portrait Calculator implemented through the shared runtime path
- WebKit browser verification for shell flow, Calculator, installed-boundary truthfulness, and browser-entry parity

**Stats:**

- 154 files changed
- 3,975 lines of TypeScript/TSX in the current codebase
- 8 phases, 24 plans, 48 tasks
- 5 days from start to ship (2026-03-31 → 2026-04-05)

**Git range:** `feat(01-01)` → `docs(08)`

**What's next:** Define the next milestone around additional apps, multi-page home behavior, and the first reusable platform/app distribution layer.

---
