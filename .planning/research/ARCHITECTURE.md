# Architecture Research: v1.1 Core Apps & Platform Foundations

**Researched:** 2026-04-06

## Existing Strengths to Reuse

- shared app registry and runtime launch path
- shared app surface and motion system
- browser/install entry split
- browser verification harness

## Recommended Architecture Direction

### 1. Extend the app model, do not bypass it

Add new typed metadata for:
- home-screen page placement
- app settings capability
- app storage namespace
- app management visibility

This should remain an evolution of the existing runtime app model, not a parallel platform model.

### 2. Build a small platform layer before the apps

Introduce internal primitives used by `Settings`, `Notes`, and `Browser`:
- app/page placement selector(s)
- preference store contract
- app settings registration
- storage contract

Then plug each app into that layer.

### 3. Keep `Settings` as the internal control plane

`Settings` should be the first user-visible host for platform primitives:
- openOS preferences
- maybe app list / app info / app-specific settings entrypoints
- internal diagnostics/management seams that can grow later

### 4. Keep `Notes` persistence isolated

`Notes` should own its own storage module/repository and consume the shared platform namespace conventions.
Do not entangle notes persistence with global shell state.

### 5. Keep `Browser` isolated behind one managed web-view wrapper

One browser host component should:
- accept curated destinations
- render iframe when embedding works
- detect/load failure or blocked state heuristically
- show fallback UI and external-open path

Do not let arbitrary external sites shape the broader app/runtime architecture.

## Suggested Build Order

1. Multi-page home-screen/runtime extension
2. Internal app-platform primitives
3. Settings app
4. Notes app
5. Browser app
6. Verification and polish

## Likely Files / Areas

- runtime app registry and runtime state
- shell/home-screen layout and page indicators
- new platform modules for preferences/settings/storage metadata
- `Settings` app module
- `Notes` app module with storage adapter
- `Browser` app module with iframe host
- Playwright and unit tests for new behaviors
