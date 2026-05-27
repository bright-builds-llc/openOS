---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 16-2026-04-11T15-41-23
generated_at: 2026-04-11T15:41:23.614Z
---

# Phase 16: Notes Search and Organization - Context

**Gathered:** 2026-04-11  
**Status:** Ready for planning  
**Mode:** Yolo

<domain>
## Phase Boundary

Make `Notes` meaningfully more useful without changing its core truthfulness model. This phase covers local search across note content, durable note organization, and browsing notes through that structure inside the existing Notes app. It does not add sync, accounts, rich text, collaboration, pinned notes, or general-purpose document management.

</domain>

<decisions>
## Implementation Decisions

### Search and organization model
- **D-01:** Use folders, not tags, for the first durable Notes organization model so the feature stays visually legible and close to the current built-in Notes direction.
- **D-02:** Keep the folder model single-level and local-only for this phase.
- **D-03:** Every note belongs to exactly one stored folder, with `All Notes` treated as a virtual browse/filter view instead of persisted content.
- **D-04:** Migrate existing flat notes into a default `Notes` folder so existing local data survives the upgrade.

### Search behavior
- **D-05:** Search should be immediate, case-insensitive, and match both note title and body text.
- **D-06:** Search applies within the currently selected folder view, while `All Notes` searches the full local collection.

### Product truthfulness and UI
- **D-07:** Keep the local-only/no-sync warning prominent in the primary Notes surface.
- **D-08:** Keep Notes focused on plain-text local note-taking; do not broaden into tags, rich text, or sync/account flows.
- **D-09:** Folder creation and folder reassignment should happen inside the app UI without hidden browser prompts.

### the agent's Discretion
- Exact folder-chip, search-bar, and editor layout as long as the flow stays coherent on portrait iPhone sizes.
- Exact storage snapshot shape, so long as legacy flat-note payloads migrate safely and the persistence path stays local-first.
- Exact targeted verification coverage, as long as it proves folder browsing, search, persistence, and visible local-only messaging.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone scope
- `.planning/ROADMAP.md` — Phase 16 goal, scope, and success criteria.
- `.planning/REQUIREMENTS.md` — `NOTE-05` and `NOTE-06`.
- `.planning/STATE.md` — current milestone state and latest shipped milestone context.
- `.planning/PROJECT.md` — long-term Notes, Browser, and platform growth direction.

### Existing Notes implementation
- `src/features/apps/notes/NotesApp.tsx` — current flat-list Notes surface and local-only warning.
- `src/features/apps/notes/notesModel.ts` — current note domain shape.
- `src/features/apps/notes/notesStorage.ts` — current local Notes persistence layer.
- `src/features/apps/notes/notes.css` — current Notes app visual structure.
- `tests/e2e/notes.spec.ts` — current browser-path Notes verification.

### Shared runtime/platform seams
- `src/features/runtime/appRegistry.ts` — canonical Notes runtime metadata path.
- `src/features/platform/appDefinitions.ts` — Notes app metadata and launch surface.

</canonical_refs>

<specifics>
## Specific Ideas

- The upgrade should feel like the same Notes app grew up, not like a different product was dropped into openOS.
- Folder browsing needs to stay obvious enough that users understand where a note lives even from `All Notes`.
- Search should stay fast and lightweight; this phase does not need advanced indexing or ranking.

</specifics>

<deferred>
## Deferred Ideas

- Tags, smart folders, or multi-folder membership.
- Rich-text editing, attachments, or collaboration.
- Sync/account recovery, cross-device data, or server-backed search.

</deferred>

---
*Phase: 16-notes-search-and-organization*  
*Context gathered: 2026-04-11*
