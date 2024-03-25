#!/bin/bash

# Pull the latest Docker image from your Docker registry
docker pull norcore/fictional-employee-db-server:"${GITHUB_RUN_NUM}"

# Run the Docker container with the newly pulled image
docker run -d --name fictional-employee-db-server \
           -p 3001:3001 \
           -e MONGO_URI="${MONGO_URI}" \
           -e REACT_APP_FRONTEND_URL="${REACT_APP_FRONTEND_URL}" \
           -e REACT_APP_BACKEND_URL="${REACT_APP_BACKEND_URL}" \
           -e GITHUB_RUN_NUM="${GITHUB_RUN_NUM}" \
           norcore/fictional-employee-db-server:"${GITHUB_RUN_NUM}"
