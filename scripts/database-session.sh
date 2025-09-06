#!/bin/bash

source .env

# Configuration
PUBLIC_KEY_PATH="$HOME/.ssh/oci.pub"
PRIVATE_KEY_PATH="$HOME/.ssh/oci"
LOCAL_PORT=$DATABASE_PORT
DATABASE_PRIVATE_IP=10.0.2.50

# Check if argument is provided to return PID
RETURN_PID=false
if [[ "$1" == "--pid" || "$1" == "-p" ]]; then
    RETURN_PID=true
fi


# List sessions and filter for ACTIVE and matching instance
ACTIVE_SESSION=$(oci bastion session list \
    --bastion-id "$BASTION_OCID" \
    --session-lifecycle-state ACTIVE \
    --all \
    --output json | jq -r --arg DATABASE_OCID "$DATABASE_OCID" '.data[] | select(.["target-resource-details"].["target-resource-id"] == $DATABASE_OCID) | @json' | head -n 1)

if [[ -n "$ACTIVE_SESSION" ]]; then
    SESSION_ID=$(echo "$ACTIVE_SESSION" | jq -r '.id')
    EXPIRATION=$(echo "$ACTIVE_SESSION" | jq -r '.["time-updated"]')
    SESSION_TTL=$(echo "$ACTIVE_SESSION" | jq -r '.["session-ttl-in-seconds"]')

    # Calculate session expiration time by adding TTL (in seconds) to time-updated
    SESSION_EXPIRATION=$(date -d "$EXPIRATION + $SESSION_TTL seconds" +"%Y-%m-%d %H:%M:%S %Z")

    if [[ "$RETURN_PID" == false ]]; then
        echo "Found ACTIVE session"
        echo "Session expires at: $SESSION_EXPIRATION"
    fi
else
    echo "Creating Bastion session for port forwarding..."
    SESSION_JSON=$(oci bastion session create-port-forwarding \
        --bastion-id "$BASTION_OCID" \
        --target-resource-id "$DATABASE_OCID" \
        --target-private-ip "$DATABASE_PRIVATE_IP" \
        --target-port $DATABASE_PORT \
        --ssh-public-key-file "$PUBLIC_KEY_PATH" \
        --key-type PUB \
        --session-ttl 10800 \
        --output json)
    SESSION_ID=$(echo "$SESSION_JSON" | jq -r '.data.id')

    if [[ -z "$SESSION_ID" || "$SESSION_ID" == "null" ]]; then
        echo "Failed to extract session identifier."
        exit 1
    fi

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

# Start port forwarding using SSH and ProxyCommand
if [[ "$RETURN_PID" == false ]]; then
    echo "Starting port forwarding: localhost:$LOCAL_PORT -> $DATABASE_PRIVATE_IP:$DATABASE_PORT"
fi

if [[ "$RETURN_PID" == true ]]; then
    # Start SSH in background and capture PID
    ssh -i "$PUBLIC_KEY_PATH" -N -L $LOCAL_PORT:$DATABASE_PRIVATE_IP:$DATABASE_PORT -p 22 $SESSION_ID@host.bastion.sa-saopaulo-1.oci.oraclecloud.com &
    SSH_PID=$!
    echo $SSH_PID
else
    # Start SSH in foreground (original behavior)
    ssh -i "$PUBLIC_KEY_PATH" -N -L $LOCAL_PORT:$DATABASE_PRIVATE_IP:$DATABASE_PORT -p 22 $SESSION_ID@host.bastion.sa-saopaulo-1.oci.oraclecloud.com
fi
