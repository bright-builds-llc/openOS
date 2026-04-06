# Features Research: v1.1 Core Apps & Platform Foundations

**Researched:** 2026-04-06

## Table Stakes

### Settings
- open as a real app from the launcher
- expose openOS-specific preferences, not generic OS cloning
- preference changes apply immediately where appropriate
- preferences persist locally

### Notes
- note list
- create note
- edit note
- delete note
- reopen saved notes after relaunch
- explicit local-only / no-sync warning

### Browser
- open as a real app from the launcher
- curated destinations rather than arbitrary web
- managed iframe surface
- clear blocked-embed state
- graceful external-open fallback

### Home Screen Pages
- multiple pages
- page indicator / page awareness
- returning home lands on the correct page
- page layout still feels iPhone-like, not like arbitrary tabs

### Platform Primitives
- shared app metadata beyond a single flat registry
- per-app settings/storage conventions
- internal app management or diagnostics surface in Settings

## Differentiators

- Settings explicitly controls openOS-specific preferences instead of imitating iOS system settings indiscriminately
- Notes is honest about local persistence and lack of sync
- Browser is constrained and truthful rather than pretending to browse anything
- Platform primitives are designed around future app growth instead of one-off app wiring

## Anti-Features

- full general-purpose browser claims
- sync/cloud accounts in Notes for this milestone
- folders/search/rich text in Notes unless basic CRUD is already solved cleanly
- app marketplace / public submission flow in this milestone
- arbitrary iframe embedding with no blocked-site fallback

## Complexity Notes

- `Settings`: medium
- `Notes`: medium
- `Browser`: medium-high due to embedding constraints and fallback UX
- multi-page home screens: medium-high because it touches runtime, layout, and navigation expectations
- platform primitives: medium-high because under-scoping causes churn later, but over-scoping wastes time now
