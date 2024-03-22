#!/bin/bash

# Pull the latest Docker image from your Docker registry
docker pull norcore/fictional-employee-db-server:${GITHUB_RUN_NUMBER}

# Run the Docker container with the newly pulled image
docker run -d --name fictional-employee-db-server \
           -p 3001:3001 \
           -e MONGO_URI=${MONGO_URI} \
           -e FRONTEND_URL=${FRONTEND_URL} \
           -e BACKEND_URL=${BACKEND_URL}\
           norcore/fictional-employee-db-server:${GITHUB_RUN_NUMBER}
