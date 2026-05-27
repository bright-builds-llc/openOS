# Phase 23: State Contracts And Verification Baseline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-27T21:24:49.904Z
**Phase:** 23-state-contracts-and-verification-baseline
**Mode:** Yolo
**Areas discussed:** Storage Contract, Snapshot Shape And Parsing, Architecture Boundary, Verification Baseline

---

## Storage Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Canonical namespace plus `.session` suffix | Use `openos.apps.<canonical>.session` for disposable app UI state, while durable data keeps existing feature keys. | yes |
| App-specific arbitrary keys | Let each app pick unrelated session key names. | |
| Store session state with durable app data | Mix UI context into durable data snapshots. | |

**User's choice:** Auto-selected recommended default.
**Notes:** This keeps Browser grid/dock identity from Phase 22 intact and makes disposable state visibly separate from durable Notes or Library data.

---

## Snapshot Shape And Parsing

| Option | Description | Selected |
|--------|-------------|----------|
| Versioned app-owned snapshots with shared safe parser/write status | Shared helper handles storage mechanics; each app owns its payload schema and defaults. | yes |
| Single global session schema for every app | Centralize all payload shapes in one cross-app schema. | |
| Throw on malformed or unwritable session storage | Let app shells handle storage exceptions directly. | |

**User's choice:** Auto-selected recommended default.
**Notes:** This aligns with the existing Notes storage parser pattern and avoids a fragile global state manager.

---

## Architecture Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Functional core plus thin storage adapters | Keep parsing/status decisions pure and keep `localStorage` calls in adapters. | yes |
| Put app payloads into `HomeScreenRuntimeState` | Expand shell runtime state to own app-specific context. | |
| Add external state manager | Add a global package for local app-session state. | |

**User's choice:** Auto-selected recommended default.
**Notes:** Research explicitly recommends keeping the shell thin and avoiding new runtime dependencies.

---

## Verification Baseline

| Option | Description | Selected |
|--------|-------------|----------|
| Create `verify:v1.3` now with focused state-contract tests | Establish the milestone command early and let later phases expand it. | yes |
| Wait until Phase 28 to create aggregate verification | Delay the milestone gate until all features exist. | |
| Rely only on existing `verify:v1.2` | Keep using the previous milestone command. | |

**User's choice:** Auto-selected recommended default.
**Notes:** Phase 23 is the right place to prove state reset, malformed payload handling, write-failure status, and durable-data isolation before UI-heavy phases build on it.

---

## the agent's Discretion

- Exact helper naming, TypeScript type naming, and test fixture layout are delegated to the agent.

## Deferred Ideas

- Notes document migration, Browser tabs, submitted-app registry generation, and broad cross-app resume UI are deferred to their mapped later phases.
