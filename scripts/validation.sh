#!/bin/bash

set -e

echo "Linting backend"
(cd ../backend && npm run lint)

echo "Linting frontend"
(cd ../frontend && npm run lint)

echo "Running unit tests"
npm run test:db
(cd ../backend && npm run test:db-init)
(cd ../backend && npm run test)

echo "Starting Docker"
(cd .. && npm run dev)

echo "Waiting for servers to start"
sleep 10

echo "Running e2e tests"
(cd ../frontend && npm run cypress:run)

echo "Stopping Docker"
(cd .. && npm run dev:down && npm run test:down:db)

