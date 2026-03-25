#!/bin/bash
# Forge Keep-Alive Script
# Runs every 10 minutes via cron
# Ensures OpenClaw container is always running

LOGFILE=~/Forge/openclaw/logs/watchdog.log
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

if ! docker ps | grep -q openclaw; then
  echo "$TIMESTAMP -- OpenClaw was down. Restarting." >> $LOGFILE
  cd ~/Forge/openclaw && docker compose up -d
  echo "$TIMESTAMP -- OpenClaw restarted successfully." >> $LOGFILE
else
  echo "$TIMESTAMP -- OpenClaw running normally." >> $LOGFILE
fi
