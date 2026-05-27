# Feature Landscape: v1.3 Stateful Apps & Platform Maturity

**Domain:** Installed iPhone-style mobile web OS shell with local apps and reviewed app catalog
**Researched:** 2026-05-27
**Overall confidence:** HIGH for user expectations and existing openOS dependencies; MEDIUM for exact implementation sequencing

## Scope

This research focuses only on v1.3 expected behavior. It assumes the shipped v1.2 baseline already exists:

| Existing shipped behavior | v1.3 dependency |
| --- | --- |
| Local `Notes` with persistent notes, folders, search, migration, and no-sync messaging | Rich editing must migrate existing plain notes and keep search/folders truthful. |
| Truthful `Browser` with direct address entry, curated destinations, inline-vs-external fallback classification, and shared grid/dock identity | Tabs and sessions must preserve the same fallback truthfulness and shared namespace. |
| Multi-page home screen, shared runtime metadata, app storage namespaces, and launcher-path verification | App-state restoration should be built as a shared platform behavior, not app-specific hacks. |
| Reviewed submitted manifests, fail-closed drift validation, and metadata-driven `Library` catalog | Safer submission/catalog workflow should reduce manual registry drift before any install escape hatch. |

## User-Centered Principles

1. Restore meaningful context, not every transient pixel. Users should return to the note, folder, tab, address, catalog filter, or settings section they were using.
2. Keep local-only and Browser limitations visible. Richer state must not imply account sync, cloud backup, Safari parity, or arbitrary app installation.
3. Prefer small native-feeling affordances over broad parity claims. v1.3 should make existing apps feel deeper without adding images, collaboration, downloads, passwords, payments, or marketplace dynamics.
4. Make state inspectable and recoverable. Corrupt saved state should reset gracefully, while user-authored data remains protected by migration tests.

## Table Stakes

Features users will reasonably expect once v1.3 claims richer Notes, Browser tabs/session state, app-state restoration, and safer platform workflow.

| Area | Feature | Expected user behavior | Complexity | Depends on |
| --- | --- | --- | --- | --- |
| Notes editing | Backward-compatible rich note model | Existing v1.2 notes open unchanged, then can be saved into the richer model without losing title, body, folder, timestamps, searchability, or local-only warning. | High | `notesStorage` v2 migration, `Note` title/body/folder model, launcher-path Notes tests |
| Notes editing | Basic format toolbar | User can apply common structure from a compact portrait toolbar: heading/subheading, bold, italic, bullet list, numbered list, and checklist. | High | Current title/body editor, mobile responsive Notes layout |
| Notes editing | Checklists that behave like note content | User can add checklist items, toggle them complete/incomplete, edit item text, and still find the note through search. | High | Rich content serialization, plain-text search projection |
| Notes editing | Section/heading structure | User can break long notes into sections and collapse/expand sections without losing content. | Medium-High | Rich editor model, current local-only persistence |
| Notes editing | Search and previews still work | Search matches readable text from formatted notes; list previews show meaningful plain text instead of markup noise. | Medium | Existing `filterNotes`, `getNotePreview`, folder filters |
| Notes editing | Autosave with durable local persistence | User edits a note, leaves Notes, reloads openOS, and sees the latest content still present with an updated timestamp. | Medium | Existing local storage namespace and Notes update path |
| Browser tabs/state | Multiple independent tabs | User can open a new tab, switch between tabs, close a tab, and keep one predictable active tab selected. | High | Existing destination model and Browser UI |
| Browser tabs/state | Per-tab address and render status | Each tab keeps its own address, title, source (`curated`/`direct`), and render mode (`embedded`/`external-fallback`). | Medium-High | `BrowserDestination` and fallback model |
| Browser tabs/state | Session restore | User leaves Browser or reloads openOS and returns to the same active tab plus recent open tabs, within a sensible storage limit. | Medium-High | Shared Browser storage namespace, direct recents |
| Browser tabs/state | Recently closed recovery | User who closes the wrong tab can reopen it from a small recent-closed list. | Medium | Persistent tab/session model |
| Browser tabs/state | Honest external fallback per tab | External or blocked pages remain fallback cards with an open-in-Safari action; they never masquerade as successfully embedded pages. | Medium | Current fallback UI and direct destination classification |
| Browser tabs/state | Minimal per-tab history | Back/forward controls should work for openOS-managed destinations in a tab. If iframe history cannot be controlled honestly, the UI should not claim full page history. | High | Browser navigation model, iframe constraints |
| App-state restoration | Built-in app resume | Returning to Notes, Browser, Settings, Calculator, or Library restores useful context instead of always cold-starting. | High | Shared runtime metadata and per-app storage namespaces |
| App-state restoration | Refresh/relaunch restoration | After a browser refresh or installed-app relaunch, openOS restores the last open app only when the saved state is valid and safe. | High | Runtime shell state, local storage, app definitions |
| App-state restoration | App-specific state contracts | Each built-in app defines a small versioned state shape: Notes selected folder/note/search, Browser tabs/active tab, Library category/detail, Settings section, Calculator display. | Medium-High | Functional core app models, app storage helpers |
| App-state restoration | Corrupt-state recovery | If saved state is invalid, user-authored data remains intact and the app resets to a sensible default rather than crashing. | Medium | Boundary parsing, versioned migrations |
| App-state restoration | Reset/clear recent state | User can clear recent app state without deleting core authored data unless a destructive clear-data action is explicitly chosen. | Medium | Settings app-management surface |
| Submission/catalog | Single source of truth for submitted metadata | Contributor adds or edits submitted app metadata once; validation and `Library` use the same discovered source without manual registry upkeep. | Medium | Existing submitted manifest contract and drift detection |
| Submission/catalog | Field-specific validation feedback | Contributor sees precise errors for id, label, summary, repository URL, icon, category, tags, review date, status, runtime id, storage namespace, and settings visibility. | Medium | `validateSubmittedAppManifest`, `submissions:check` |
| Submission/catalog | Draft vs catalog-ready workflow | Draft submissions can exist in repo review, but only reviewed `catalog-ready` submissions appear in the user-facing catalog. | Medium | Existing catalog status and review metadata |
| Submission/catalog | Catalog freshness guarantees | User sees Library entries that match the reviewed manifests after validation: names, summaries, categories, tags, developer, source, status, and icon treatment are not stale. | Medium | Metadata-driven `Library` selectors |
| Submission/catalog | Contributor preview | Contributor can preview the exact Library card/detail output or receive a check summary before merge. | Medium | Catalog model, validation command, CI/workflow surface |
| Submission/catalog | Honest catalog actions | User can browse and inspect apps, but install/open actions remain unavailable or clearly future-facing until the runtime supports them. | Low-Medium | Current `Library` "browse now, install later" behavior |

## Differentiators

Features that would make v1.3 feel especially polished while still fitting the milestone.

| Area | Feature | Value proposition | Complexity | Notes |
| --- | --- | --- | --- | --- |
| Notes editing | Structure-first editor instead of generic rich text | Headings, sections, lists, and checklists make local Notes useful without becoming a full document editor. | High | Strongly prefer this over broad WYSIWYG parity. |
| Notes editing | Markdown-like input shortcuts | Typing `#`, `-`, `1.`, or `[ ]` can create structure quickly for keyboard users while the toolbar remains primary on iPhone. | Medium | Nice after the rich model is stable. |
| Notes editing | Outline jump list for headings | Long local notes become navigable on a small screen. | Medium | Best paired with collapsible sections. |
| Notes editing | Plain-text export or copy-safe projection | Users can get their local content out without depending on a proprietary rich format. | Medium | Reinforces local-first honesty. |
| Browser tabs/state | Truth badges on tabs | Tab list visibly distinguishes `In openOS` from `Opens in Safari`, avoiding fake browser confidence. | Medium | Directly supports the project truthfulness bar. |
| Browser tabs/state | Recently closed tab undo | A fast undo/reopen affordance makes tab state feel safer without full history. | Medium | Keep the list short and local. |
| Browser tabs/state | Session health messaging | If restored tabs were pruned or could not be restored, Browser says what happened in product language. | Medium | Avoids silent data disappearance. |
| App-state restoration | No-flash resume | Relaunching into the last active built-in app feels continuous instead of briefly showing home then jumping. | High | Requires careful shell initialization. |
| App-state restoration | Versioned state migrations | Releases can evolve saved state without stranding users on old app context. | Medium | Should be unit tested per app. |
| App-state restoration | Per-app recent-state controls | Settings can clear Browser tabs/recents or Notes UI state separately from deleting notes. | Medium | Keeps reset behavior precise. |
| Submission/catalog | Auto-discovered manifest index | Runtime/catalog imports are generated or discovered from files so a checked-in manual registry cannot drift. | Medium-High | Natural successor to fail-closed drift detection. |
| Submission/catalog | PR/catalog preview artifact | Reviewers see the exact new catalog entry and validation result in one place. | Medium | Useful before arbitrary install flows. |
| Submission/catalog | Review ledger in Library detail | Users can see that an entry is reviewed metadata, when it was reviewed, and where the source repo lives. | Low-Medium | Builds trust without marketplace claims. |

## Anti-Features

Features to explicitly avoid in v1.3 because they would weaken the illusion, overclaim capability, or pull the milestone into backend/platform scope.

| Area | Anti-feature | Why avoid | Do instead |
| --- | --- | --- | --- |
| Notes editing | Cloud sync, accounts, shared notes, or collaboration | Breaks the local-first boundary and requires identity, backend, conflict, and recovery design. | Keep no-sync messaging and local durable migration. |
| Notes editing | Full native Notes parity | Photos, scans, handwriting, locked notes, tables, AI writing tools, attachments, and collaboration are too broad for this milestone. | Ship text structure, checklists, and safe persistence first. |
| Notes editing | Blind `contenteditable` HTML storage | Users can lose data or see markup/search corruption if arbitrary HTML becomes the data model. | Store a constrained structured document plus plain-text projection. |
| Notes editing | Formatting controls that cannot round-trip | A button that appears to work but disappears after reload breaks trust. | Only expose commands backed by serialization, migration, and tests. |
| Browser tabs/state | Safari-parity claims | openOS still cannot guarantee arbitrary iframe embedding, browser process isolation, downloads, cookies, extensions, passwords, or full history control. | Keep Browser positioned as managed browsing with honest fallback. |
| Browser tabs/state | Proxying external sites to bypass frame restrictions | Creates security, privacy, legal, and product-truth problems. | Respect `X-Frame-Options`/CSP realities and hand off externally. |
| Browser tabs/state | Persisting unlimited browsing history | Risky for privacy and local storage pressure; users did not ask for a permanent history database. | Persist a small tab session and recent-closed list with clear reset controls. |
| Browser tabs/state | Fake loaded states for external fallbacks | A tab preview that suggests content rendered in-app when it did not erodes the truthfulness bar. | Show fallback card, address, and Safari handoff. |
| App-state restoration | Restoring stale destructive flows | Reopening into delete confirmations, half-submitted forms, or stale review states is surprising and risky. | Restore stable navigation/context only. |
| App-state restoration | One global untyped app-state blob | Cross-app leakage and invalid state combinations become likely as apps grow. | Use per-app versioned state contracts under canonical namespaces. |
| App-state restoration | Treating restore as sync or backup | Users may assume data survives browser storage clearing, device replacement, or private browsing. | Keep local-only copy and reset language precise. |
| Submission/catalog | Arbitrary app install escape hatch | v1.3 is maturing reviewed metadata, not executing unreviewed apps. | Improve submission safety and catalog trust first. |
| Submission/catalog | Marketplace features | Ratings, reviews, payments, rankings, and reputation systems add policy and moderation surface. | Keep Library as a reviewed metadata catalog. |
| Submission/catalog | Unreviewed entries in Library | Users would see apps that bypass the trust gate. | Keep draft/reviewed status enforced by validation. |
| Submission/catalog | Metadata that implies unsupported runtime capability | Claims like "installed", "securely synced", "native", or "verified executable" would be dishonest today. | Use reviewed/source/provenance language and future-facing install copy. |

## Feature Dependencies

```text
Notes rich document model + migration
  -> constrained editor toolbar
  -> plain-text search/preview projection
  -> Notes selected note/folder/search restoration

Browser destination model
  -> tab state model
  -> per-tab fallback status
  -> persisted Browser session
  -> recently closed recovery

Runtime app metadata + storage namespaces
  -> per-app versioned state contracts
  -> shared restore/clear APIs
  -> launcher-path app resume tests

Submitted app manifest contract
  -> auto-discovery or generated registry
  -> validation/check summary
  -> catalog freshness and review-status enforcement
```

## MVP Recommendation

Prioritize:

1. **State model foundations**: versioned Notes rich-content migration, Browser tab/session state, and shared app-state contracts. These are prerequisites for safe UI work.
2. **User-facing Notes and Browser workflows**: compact rich editing, checklist/section behavior, tabs, restore, recently closed, and explicit fallback status.
3. **Core app resume polish**: restore meaningful context for Notes, Browser, Library, Settings, and Calculator through launcher-path scenarios.
4. **Submission/catalog safety**: remove manual registry drift, add contributor preview/check summaries, and keep `Library` aligned with reviewed manifests.

Defer:

| Feature | Reason |
| --- | --- |
| Notes sync/accounts/collaboration | Backend and identity scope would dominate the milestone. |
| Attachments/media/scanning/locked notes | Too much storage, UI, privacy, and migration surface before text structure is stable. |
| Full Browser history/downloads/passwords/private mode/extensions | Would imply Safari parity the product cannot truthfully provide. |
| Arbitrary submitted-app install/run | Requires runtime trust, permissions, sandbox, settings, storage, and rollback design beyond metadata maturity. |

## Testable Requirement Seeds

These statements are phrased so downstream requirements can turn them into UAT or automated checks.

- User creates a v1.2-style plain note, upgrades to v1.3, applies heading/list/checklist formatting, reloads, and sees the same readable content, folder, search results, and updated timestamp.
- User searches for text inside a formatted checklist item and sees the containing note in the correct folder-filtered results.
- User opens Browser, creates two tabs, navigates one to a local embedded path and one to an external destination, reloads, and sees both tabs restored with the external destination still shown as Safari fallback.
- User closes a Browser tab by mistake, reopens it from recently closed, and the restored tab keeps its address and fallback status.
- User opens Notes to a folder/search/note, returns home, opens another app, then returns to Notes and lands on the same meaningful context.
- User refreshes openOS with corrupt saved UI state and sees a stable default app/home state without losing saved notes or reviewed catalog metadata.
- Contributor adds a submitted manifest file and runs the submission check; missing or invalid fields produce field-specific errors, and valid catalog-ready metadata appears in Library without an extra manual registry edit.
- User browses Library after metadata changes and sees only reviewed catalog-ready entries with truthful browse/detail actions, not install claims.

## Confidence Assessment

| Area | Confidence | Reason |
| --- | --- | --- |
| Notes editing | HIGH | Current Apple Notes guidance establishes formatting, checklists, tags, smart folders, and collapsible sections as normal mobile note expectations; openOS already has local notes/folders/search. |
| Browser state/tabs | HIGH | Safari guidance establishes tabs, recent closed tabs, tab groups, and cross-session continuity as normal browser expectations; MDN confirms iframe restrictions that require honest fallback. |
| App-state restoration | HIGH | Apple developer guidance frames returning where the user left off as core app continuity; openOS already has runtime/app storage seams. |
| Submission/catalog workflow | MEDIUM-HIGH | Existing repo has manifest validation and drift detection; GitHub docs support structured forms, Actions checks, and CODEOWNERS review, but the exact openOS contributor UX is product-specific. |

## Sources

- Project context: `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/milestones/v1.2-REQUIREMENTS.md`, `.planning/milestones/v1.2-ROADMAP.md`.
- Current implementation seams: `src/features/apps/notes/notesModel.ts`, `src/features/apps/notes/notesStorage.ts`, `src/features/apps/browser/browserDestinations.ts`, `src/features/apps/browser/BrowserApp.tsx`, `src/features/runtime/homeScreenRuntime.ts`, `src/features/platform/submittedAppManifests.ts`, `src/features/apps/catalog/appCatalogModel.ts`.
- Apple Support, "Create and format notes on iPhone": https://support.apple.com/en-gb/guide/iphone/iph1ac0b3a2/ios
- Apple Support, "Use Tags and Smart Folders in Notes on your iPhone and iPad": https://support.apple.com/en-us/102288
- Apple Support, "Open and close tabs in Safari on iPhone": https://support.apple.com/en-ie/guide/iphone/iph489b9313f/ios
- Apple Safari product page: https://www.apple.com/safari/
- Apple Developer Documentation, "Restoring your app's state": https://developer.apple.com/documentation/uikit/restoring-your-app-s-state
- Apple Developer Documentation, "Preserving your app's UI across launches": https://developer.apple.com/documentation/uikit/preserving-your-app-s-ui-across-launches
- MDN Web Docs, "Web Storage API": https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN Web Docs, "X-Frame-Options header": https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options
- GitHub Docs, "Syntax for issue forms": https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms
- GitHub Docs, "About code owners": https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- GitHub Docs, "Workflow syntax for GitHub Actions": https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
