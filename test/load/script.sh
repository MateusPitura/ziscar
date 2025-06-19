#!/bin/bash

source .env

# Check if email and password from .env are provided
if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "Error: Email and password are required."
  exit 1
fi

# Get the directory of the script
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Path to the routes and result directory
ROUTES_DIR="$SCRIPT_DIR/routes"
RESULTS_DIR="$SCRIPT_DIR/result"

# Current timestamp
TIMESTAMP=$(date +%Y%m%d%H%M)

# If an argument is provided, use it as the test file
if [ -n "$1" ]; then
  jsfiles=$1
  if [ ! -f "${jsfiles[0]}" ]; then
    echo "Error: Test file ${jsfiles[0]} not found."
    exit 1
  fi
else
  mapfile -t jsfiles < <(find "$ROUTES_DIR" -type f -name "*.js")
fi

for jsfile in "${jsfiles[@]}"; do
  # Get relative path from routes/ (e.g., auth/get.js)
  relpath="${jsfile#$ROUTES_DIR/}"
  # Get just the file name without extension (e.g., get)
  filename_noext="$(basename "$jsfile" .js)"
  # Directory for result (e.g., result/auth)
  result_subdir="$RESULTS_DIR/$(dirname "$relpath")/${filename_noext}"

  mkdir -p "$result_subdir"

  # Run the k6 load test using the current jsfile
  k6 run --env EMAIL="$EMAIL" --env PASSWORD="$PASSWORD" "$jsfile" --summary-export="${result_subdir}/${TIMESTAMP}.json"

  # Sleep 5 seconds if not the last iteration
  [ "$jsfile" != "${jsfiles[-1]}" ] && sleep 5
done