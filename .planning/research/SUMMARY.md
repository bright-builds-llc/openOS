# Research Summary: v1.1 Core Apps & Platform Foundations

**Date:** 2026-04-06

## Stack Additions

- No major stack change is required.
- Use the existing React/Vite/TypeScript/Vitest/Playwright stack.
- Prefer a small Notes persistence adapter over new infrastructure.
- Prefer browser-standard `iframe` plus a managed wrapper over a heavier browser abstraction.

## Table Stakes

- real `Settings`, `Notes`, and managed `Browser` apps
- multi-page home-screen behavior
- local persistence and local-only warning for Notes
- blocked-embed fallback for Browser
- first internal app-platform primitives

## Recommended Architecture

- extend the runtime app model with page placement and app/platform metadata
- build a small internal platform layer first
- let `Settings` surface the first user-visible platform/app-management controls
- keep `Notes` and `Browser` isolated behind focused modules

## Watch Out For

- do not promise a general web browser
- do not under-build Notes persistence
- do not implement multi-page home screens as shell-only presentation
- do not overbuild the app platform beyond what `Settings`, `Notes`, and `Browser` need now

## Milestone Shape

Recommended milestone focus:
1. multi-page home screens + runtime extension
2. internal app-platform primitives
3. `Settings`
4. `Notes`
5. managed-iframe `Browser`
6. verification/polish
