#!/bin/sh
set -e

# Copier les fichiers initiaux seulement si le dossier est vide
if [ -z "$(ls -A /app/workdir)" ]; then
  echo "Initializing workdir with example files..."
  cp -r /app/runnerDemo* /app/workdir/runner
fi

exec "$@"