#!/bin/bash

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io
sudo apt-get install gnupg
wget -qO- https://www.mongodb.org/static/pgp/server-7.0.asc | sudo tee /etc/apt/trusted.gpg.d/server-7.0.asc
sudo touch /etc/apt/sources.list.d/mongodb-org-7.0.list
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-mongosh
sudo service docker start

# Add your user to the docker group to run Docker commands without sudo
sudo usermod -aG docker $USER

# Ensure that SSH server is configured to accept GITHUB_RUN_NUMBER environment variable
sudo sh -c 'echo "AcceptEnv MONGO_URI REACT_APP_FRONTEND_URL REACT_APP_BACKEND_URL" >> /etc/ssh/sshd_config'

# Restart SSH service to apply the changes
sudo systemctl restart sshd

# Log out and log back in to apply the group membership changes
exit