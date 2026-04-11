#!/usr/bin/env bash

set -euo pipefail

echo "[verify:v1.2] validating submitted app manifests"
bun run submissions:check

echo "[verify:v1.2] running unit and integration tests"
bun run test

echo "[verify:v1.2] running explicit typecheck"
bun x tsc --noEmit

echo "[verify:v1.2] building production bundle"
bun run build

echo "[verify:v1.2] running full webkit-iphone launcher-path suite"
bun run test:e2e --project=webkit-iphone
