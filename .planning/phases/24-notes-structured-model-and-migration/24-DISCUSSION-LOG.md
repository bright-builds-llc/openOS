# Phase 24: Notes Structured Model And Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-28T03:13:15.440Z
**Phase:** 24-notes-structured-model-and-migration
**Mode:** Yolo
**Areas discussed:** Structured model, Migration and durability, Search and preview, Architecture and verification

---

## Structured Model

| Option | Description | Selected |
|--------|-------------|----------|
| Versioned structured blocks | Move durable Notes to a v3 model with typed paragraph, heading, and checklist text blocks. | yes |
| Keep plain body only | Preserve the current `body` string as the canonical durable content shape. | |
| Adopt editor framework model | Introduce a rich-text editor or third-party document schema now. | |

**User's choice:** Auto-selected versioned structured blocks.
**Notes:** This best satisfies Phase 24 without dragging Phase 25 editor UI or new dependencies into the migration phase.

---

## Migration And Durability

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve and normalize | Migrate v2 and legacy notes into v3 while preserving title, body text, folder, timestamps, and searchability. | yes |
| Fresh v3 only | Support only new v3 notes and treat older payloads as empty. | |
| Sidecar migration | Keep old notes untouched and write structured content into a second durable key. | |

**User's choice:** Auto-selected preserve and normalize.
**Notes:** Phase 24 exists to make existing notes safe in the new model, so migration must be first-class and stay on the canonical durable Notes key.

---

## Search And Preview

| Option | Description | Selected |
|--------|-------------|----------|
| Search all structured text | Index title plus paragraph, heading, and checklist text; generate previews from meaningful structured text. | yes |
| Search title and legacy body only | Keep current search implementation unchanged. | |
| Defer structured search | Store structured content now but wait until later to search it. | |

**User's choice:** Auto-selected search all structured text.
**Notes:** This directly covers `NOTES-04` while keeping the current Notes UI behavior compatible.

---

## Architecture And Verification

| Option | Description | Selected |
|--------|-------------|----------|
| Pure model plus storage boundary | Keep content parsing/normalization in pure helpers and localStorage effects in Notes storage. | yes |
| Component-owned migration | Let `NotesApp.tsx` transform payloads while rendering. | |
| Global state manager | Add a shared app-state dependency to own Notes content. | |

**User's choice:** Auto-selected pure model plus storage boundary.
**Notes:** This carries forward Bright Builds and Phase 23 functional-core/imperative-shell decisions and avoids a new state dependency.

---

## the agent's Discretion

- The exact module split and serialized v3 names are left to the implementation agent, with a preference for small pure helpers.
- The migration may persist v3 eagerly or lazily if tests prove structured notes are returned and existing data is not lost.

## Deferred Ideas

- Rich editing controls, checklist authoring, and Notes resume state are deferred to Phase 25.
- Sync/accounts, attachments, collaboration, and locked notes remain outside v1.3.
