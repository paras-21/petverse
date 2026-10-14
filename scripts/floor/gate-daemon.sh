#!/usr/bin/env bash
# gate-daemon: run in a window Claude Code did not start (its memory guard reaps its own
# background commands). Watches .floor/gate-queue.txt and gates each listed unit in turn,
# landing it when it passes (gate-queue.sh --land), then syncs main with floor/mvp1 (sync.sh).
#
#   start:  .floor\run-gate-daemon.cmd      (or: bash scripts/floor/gate-daemon.sh)
#   queue:  echo 1.2 >> .floor/gate-queue.txt
#   stop:   echo STOP >> .floor/gate-queue.txt
#
# One gate at a time, and none while another `floor gate` is already running.
# Each result is appended to .floor/results/gate-daemon.log.
set -uo pipefail
cd "$(dirname "$0")/../.."
Q=.floor/gate-queue.txt; LOG=.floor/results/gate-daemon.log
mkdir -p .floor/results; touch "$Q"; echo "daemon up $(date '+%F %H:%M')" >> "$LOG"
# Filter by process Name first: matching command lines alone also matches this PowerShell query itself.
busy() { powershell -NoProfile -Command "@(Get-CimInstance Win32_Process | Where-Object { \$_.Name -eq 'node.exe' -and \$_.CommandLine -match 'floor.mjs gate' }).Count" | tr -d '\r'; }
while true; do
  u=$(head -1 "$Q" | tr -d '\r[:space:]')
  if [ -z "$u" ]; then sleep 20; continue; fi
  [ "$u" = STOP ] && { sed -i '1d' "$Q"; echo "daemon stopped $(date +%H:%M)" >> "$LOG"; exit 0; }
  while [ "$(busy)" != "0" ]; do sleep 30; done
  sed -i '1d' "$Q"
  # Never gate a unit before its deps have landed: precheck would fail on the parent's files and the
  # unit would be dropped. Rotate it to the back; pause when nothing in the queue is gateable yet.
  if ! miss=$(node scripts/floor/deps-landed.mjs "$u"); then
    echo "$u" >> "$Q"
    echo "WAIT $u (needs $miss) $(date +%H:%M)" >> "$LOG"
    all_blocked=1
    while read -r q; do q=$(echo "$q" | tr -d '\r[:space:]'); [ -z "$q" ] && continue
      [ "$q" = STOP ] && { all_blocked=0; break; }
      node scripts/floor/deps-landed.mjs "$q" >/dev/null && { all_blocked=0; break; }
    done < "$Q"
    [ $all_blocked = 1 ] && sleep 120
    continue
  fi
  bash scripts/floor/gate-queue.sh --land "$u" >> "$LOG" 2>&1
  if [ $? -eq 75 ]; then   # low disk: put the unit back at the front and wait
    sed -i "1i $u" "$Q" 2>/dev/null || { echo "$u" | cat - "$Q" > "$Q.tmp" && mv "$Q.tmp" "$Q"; }
    echo "REQUEUED $u (low disk) $(date +%H:%M)" >> "$LOG"; sleep 300; continue
  fi
  bash scripts/floor/sync.sh >> "$LOG" 2>&1 || echo "sync needs attention" >> "$LOG"
  echo "DONE $u $(date +%H:%M)" >> "$LOG"
done
