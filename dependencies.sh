#!/bin/bash

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io
sudo service docker start

# Add your user to the docker group to run Docker commands without sudo
sudo usermod -aG docker $USER

# Ensure that SSH server is configured to accept GITHUB_RUN_NUMBER environment variable
sudo sh -c 'echo "AcceptEnv GITHUB_RUN_NUMBER" >> /etc/ssh/sshd_config'

# Restart SSH service to apply the changes
sudo systemctl restart sshd

# Log out and log back in to apply the group membership changes
exit