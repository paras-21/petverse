#!/usr/bin/env bash
# sync: keep the main checkout's branch (main) and the integration branch (floor/mvp1) equal.
# Landings move floor/mvp1; leader commits move main. Merge the first into the second, then
# fast-forward integration. Run after every land and before every commit batch.
# It merges into whatever branch the main checkout has checked out; it refuses a dirty tree
# so it never mixes a landing into uncommitted leader work.
set -euo pipefail
cd "$(dirname "$0")/../.."
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "sync skipped: main checkout has uncommitted changes (commit them, then rerun scripts/floor/sync.sh)"
  exit 1
fi
git merge -q --no-edit floor/mvp1
git -C ../bits-wt/_integration merge --ff-only -q "$(git branch --show-current)"
echo "synced at $(git rev-parse --short HEAD)"
