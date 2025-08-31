#!/bin/bash

# Build k6 image using docker-compose at project root
docker-compose -f docker-compose.test.yml build k6

# Get the directory of the script and the docker volume
SCRIPT_DIR=$(dirname "$(realpath "$0")")
DOCKER_VOLUME=test/load

# Path to the routes and result directory
ROUTES_DIR="$SCRIPT_DIR/routes"
RESULTS_DIR="$SCRIPT_DIR/result"

# Current timestamp
TIMESTAMP=$(date +%Y%m%d%H%M)

# If an argument is provided, use it as the test file
if [ -n "$1" ]; then
  jsfiles=$1
  if [ ! -f "${jsfiles[0]}" ]; then
    echo "Error: test file ${jsfiles[0]} not found."
    exit 1
  fi
  jsfiles=("$SCRIPT_DIR/${1#$DOCKER_VOLUME/}")
else
  mapfile -t jsfiles < <(find "$ROUTES_DIR" -type f -name "*.js")
fi

for jsfile in "${jsfiles[@]}"; do
  # Get relative path from routes/ (e.g., auth/get.js)
  relpath="${jsfile#$ROUTES_DIR/}"
  # Get just the file name without extension (e.g., get)
  filename_noext="$(basename "$jsfile" .js)"
  # Directory for result (e.g., result/auth/get)
  result_subdir="$RESULTS_DIR/$(dirname "$relpath")/${filename_noext}"

  mkdir -p "$result_subdir"

  # Get the file path inside the container
  container_jsfile="/$DOCKER_VOLUME/routes/${relpath}"

  # Run the k6 load test using the current jsfile and save the output
  docker-compose -f docker-compose.test.yml run --rm k6 run "$container_jsfile" 2>&1 | tee "$result_subdir/${TIMESTAMP}.out"

  # Sleep 5 seconds if not the last iteration
  [ "$jsfile" != "${jsfiles[-1]}" ] && sleep 5
done