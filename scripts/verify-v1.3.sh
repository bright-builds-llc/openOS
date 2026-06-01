#!/usr/bin/env bash

set -euo pipefail

echo "[verify:v1.3] validating submitted app manifests"
bun run submissions:check

echo "[verify:v1.3] running focused state contract tests"
bun run test -- \
  src/features/platform/appStorage.test.ts \
  src/features/platform/appSessionStorage.test.ts \
  src/features/runtime/appRegistry.test.ts \
  src/features/apps/notes/notesContent.test.ts \
  src/features/apps/notes/notesModel.test.ts \
  src/features/apps/notes/notesStorage.test.ts \
  src/features/apps/notes/notesSession.test.ts

echo "[verify:v1.3] running full unit and integration tests"
bun run test

echo "[verify:v1.3] running explicit typecheck"
bun x tsc --noEmit

echo "[verify:v1.3] building production bundle"
bun run build

echo "[verify:v1.3] running full webkit-iphone launcher-path suite"
bun run test:e2e --project=webkit-iphone
