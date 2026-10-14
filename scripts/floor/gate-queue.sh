#!/usr/bin/env bash
# gate-queue: gate floor units one after another, from YOUR terminal (Git Bash).
#
#   bash scripts/floor/gate-queue.sh 1.2 1.3
#   bash scripts/floor/gate-queue.sh --land 1.2 1.3   (land each passing unit at once, so the next gate builds on it)
#
# Claude Code stops background commands when memory runs low, so long gate runs
# belong in a terminal it did not start. Results land in .floor/results/<unit>.*
# as usual. Without --land a passing unit still needs `floor land <unit>` (the leader does it).
# After a land: the unit's worktree is removed and its test_<unit> schema dropped (unit-db.mjs drop).
set -uo pipefail
cd "$(dirname "$0")/../.."
export PATH="$HOME/.local/bin:$PATH"
WT=../bits-wt
LAND=0; [ "${1:-}" = "--land" ] && { LAND=1; shift; }
for u in "$@"; do
  free=$(powershell -NoProfile -Command "[int]((Get-PSDrive C).Free/1GB)" | tr -d '\r')
  [ "$free" -lt 5 ] && { echo "STOP: only ${free} GB free on C:"; exit 75; }
  echo "=== gate $u ($(date +%H:%M))"
  s=$(date +%s)
  floor gate "$u" 2>&1 | grep -E "PASS|FAIL|GATE|INCOMPLETE"
  last=$(tail -1 .floor/ledger.jsonl 2>/dev/null)
  if [ $LAND = 1 ] && [[ "$last" == *'"type":"gate.pass"'* && "$last" == *"\"unit\":\"$u\""* ]]; then
    floor land "$u" && { timeout 300 git worktree remove --force "$WT/$u" || echo "WARN worktree remove for $u timed out (folder left behind)"; } && node scripts/floor/unit-db.mjs drop "$u" 2>&1 | tail -1
  fi
  # Disk: a waiting worktree does not need node_modules or build output - the next gate's
  # install and build steps recreate them.
  for d in "$WT/$u/node_modules" "$WT/$u/chain/node_modules" "$WT/$u/.next" "$WT/$u/chain/artifacts" "$WT/$u/chain/cache"; do
    [ -d "$d" ] && powershell -NoProfile -Command "cmd /c rmdir /s /q '$(cygpath -w "$d")'"
  done
  echo "=== $u took $(( $(date +%s) - s ))s"
  grep -E "^- \[(high|critical)\]" ".floor/results/$u.reviews.md" 2>/dev/null | cut -c1-200
done
