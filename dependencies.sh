#!/bin/bash

# Install Dependencies
sudo apt-get update
sudo apt-get install -y docker.io
sudo service docker start

# Add your user to the docker group to run Docker commands without sudo
sudo usermod -aG docker $USER

# Debugging: Print out the values of environment variables
echo "MONGO_URI: ${MONGO_URI}"
echo "REACT_APP_FRONTEND_URL: ${REACT_APP_FRONTEND_URL}"
echo "REACT_APP_BACKEND_URL: ${REACT_APP_BACKEND_URL}"
echo "GITHUB_RUN_NUM: ${GITHUB_RUN_NUM}"

# Ensure that SSH server is configured to accept GITHUB_RUN_NUMBER environment variable
sudo sh -c 'echo "AcceptEnv MONGO_URI REACT_APP_FRONTEND_URL REACT_APP_BACKEND_URL" >> /etc/ssh/sshd_config'

# Restart SSH service to apply the changes
sudo systemctl restart sshd

# Log out and log back in to apply the group membership changes
exit