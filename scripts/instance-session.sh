#!/bin/bash

source .env

# Configuration
USERNAME="ubuntu"
PUBLIC_KEY_PATH="$HOME/.ssh/oci.pub"
PRIVATE_KEY_PATH="$HOME/.ssh/oci"

INSTANCE_OCID=""
PRIVATE_IP=""

# Check first argument for target type
if [[ "$1" == "-b" ]]; then
    INSTANCE_OCID=$BACKEND_OCID
    PRIVATE_IP="10.0.3.197"
    shift  # Remove -b from arguments
elif [[ "$1" == "-d" ]]; then
    INSTANCE_OCID=$DATABASE_OCID
    PRIVATE_IP="10.0.2.50"
    shift  # Remove -d from arguments
else
    echo "Error: Please specify target type:"
    echo "Usage: $0 [-b|-d] [command]"
    echo "  -b: Connect to backend server"
    echo "  -d: Connect to database server"
    exit 1
fi

# List sessions and filter for ACTIVE and matching instance
ACTIVE_SESSION=$(oci bastion session list \
    --bastion-id "$BASTION_OCID" \
    --session-lifecycle-state ACTIVE \
    --all \
    --output json | jq -r --arg INSTANCE_OCID "$INSTANCE_OCID" '.data[] | select(.["target-resource-details"].["target-resource-id"] == $INSTANCE_OCID) | @json' | head -n 1)

if [[ -n "$ACTIVE_SESSION" ]]; then
    SESSION_ID=$(echo "$ACTIVE_SESSION" | jq -r '.id')
    EXPIRATION=$(echo "$ACTIVE_SESSION" | jq -r '.["time-updated"]')
    SESSION_TTL=$(echo "$ACTIVE_SESSION" | jq -r '.["session-ttl-in-seconds"]')

    # Calculate session expiration time by adding TTL (in seconds) to time-updated
    SESSION_EXPIRATION=$(date -d "$EXPIRATION + $SESSION_TTL seconds" +"%Y-%m-%d %H:%M:%S %Z")

    echo "Found ACTIVE session"
    echo "Session expires at: $SESSION_EXPIRATION"
else
    # Create session (without wait-for-state)
    echo "Creating Bastion session..."
    SESSION_JSON=$(oci bastion session create-managed-ssh \
        --bastion-id "$BASTION_OCID" \
        --target-resource-id "$INSTANCE_OCID" \
        --target-private-ip "$PRIVATE_IP" \
        --ssh-public-key-file "$PUBLIC_KEY_PATH" \
        --key-type PUB \
        --target-os-username "$USERNAME" \
        --session-ttl 10800 \
        --output json)

    # Extract session ID
    SESSION_ID=$(echo "$SESSION_JSON" | jq -r '.data.id')

    if [[ -z "$SESSION_ID" || "$SESSION_ID" == "null" ]]; then
        echo "Failed to extract session identifier."
        exit 1
    fi

    # Poll for ACTIVE status
    echo "Waiting for session to become ACTIVE..."
    while true; do
        STATUS=$(oci bastion session get --session-id "$SESSION_ID" --output json | jq -r '.data."lifecycle-state"')
        echo "Current status: $STATUS"
        if [[ "$STATUS" == "ACTIVE" ]]; then
            break
        fi
        sleep 15
    done

    echo "Session ACTIVE"
fi

SSH_CMD=(
  ssh -i "$PRIVATE_KEY_PATH"
  -t
  -o "ProxyCommand=ssh -i $PRIVATE_KEY_PATH -W %h:%p -p 22 $SESSION_ID@host.bastion.sa-saopaulo-1.oci.oraclecloud.com"
  -p 22 "$USERNAME@$PRIVATE_IP"
)

if [[ $# -gt 0 ]]; then
    echo Running remote command...
    "${SSH_CMD[@]}" "$@"
else
    echo Starting interactive session...
    "${SSH_CMD[@]}"
fi