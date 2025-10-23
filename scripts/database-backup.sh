#!/bin/bash

set -e

echo "Start backup on $(date)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/../.env"

PATH="$PATH:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:$HOME/bin"

BACKUP_DIR="/tmp"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

mkdir -p "$BACKUP_DIR"

# Dump database from container
echo "Creating Postgres backup..."
docker exec -t ziscar_db pg_dump -U "$DB_USERNAME" "$DB_NAME" > "$BACKUP_PATH"

# Upload to oci object storage
echo "Uploading to OCI bucket..."
oci os object put -bn "bucket-backup-ziscar-db" --file "$BACKUP_PATH" --name "$BACKUP_FILE"

echo "Backup completed successfully on $(date)"
