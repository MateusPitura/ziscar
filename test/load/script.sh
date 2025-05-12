#!/bin/bash

# Get the directory of the script
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Load email and password from .env file in the same directory as the script
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
else
  echo "Error: .env file not found in $SCRIPT_DIR."
  exit 1
fi

# Check if email and password from .env are provided
if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "Error: Email and password are required."
  exit 1
fi

# Path to the JSON configuration file and output name
CONFIG_FILE="load/config.json"
TIMESTAMP=$(date +%Y%m%d%H%M)

# Replace the email and password in the JSON file
TEMP_CONFIG_FILE=$(mktemp)
jq --arg EMAIL "$EMAIL" --arg PASSWORD "$PASSWORD" '
  map(
    if .PAYLOAD then
      .PAYLOAD.email = ($EMAIL // .PAYLOAD.email) |
      .PAYLOAD.password = ($PASSWORD // .PAYLOAD.password)
    else
      .
    end
  )
' "$CONFIG_FILE" > "$TEMP_CONFIG_FILE"

# Iterate through each test configuration in the JSON file
jq -c '.[]' "$TEMP_CONFIG_FILE" | while read -r test; do
  # Check if the "skip" property exists and is true
  SKIP=$(echo "$test" | jq -r '.SKIP // false')
  if [ "$SKIP" = "true" ]; then
    continue
  fi

  # Read the test configuration variables
  VUS=$(echo "$test" | jq -r '.VUS')
  STATUS_CODE=$(echo "$test" | jq -r '.STATUS_CODE')
  ENDPOINT=$(echo "$test" | jq -r '.ENDPOINT')
  PAYLOAD=$(echo "$test" | jq -c '.PAYLOAD')
  METHOD=$(echo "$test" | jq -c '.METHOD')

  # Create the result directory for the endpoint if it doesn't exist
  mkdir -p "load/result/${ENDPOINT}"

  # Run the k6 load test with the extracted variables
  k6 run --env BASE_URL=https://api.ziscar.me --env VUS="$VUS" --env STATUS_CODE="$STATUS_CODE" --env ENDPOINT="$ENDPOINT" --env METHOD="$METHOD" --env PAYLOAD="$PAYLOAD" --env EMAIL="$EMAIL" --env PASSWORD="$PASSWORD" load/main.js --summary-export="load/result/${ENDPOINT}/VUS#${VUS}#DATE#${TIMESTAMP}.json"

  # Wait before the next test
  sleep 5
done