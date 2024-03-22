#!/bin/bash

sudo apt update
sudo apt install -y docker.io
sudo service docker start

# Add your user to the docker group to run Docker commands without sudo
sudo usermod -aG docker $USER

# Pull the latest Docker image from your Docker registry
docker pull norcore/fictional-employee-db-server:${GITHUB_RUN_NUMBER}

# Stop and remove the existing container (if any)
docker stop fictional-employee-db-server || true
docker rm fictional-employee-db-server || true

# Run the Docker container with the newly pulled image
docker run -d --name fictional-employee-db-server \
           -p 3001:3001 \
           -e MONGO_URI=${MONGO_URI} \
           -e FRONTEND_URL=${FRONTEND_URL} \
           -e BACKEND_URL=${BACKEND_URL}\
           norcore/fictional-employee-db-server:${GITHUB_RUN_NUMBER}
