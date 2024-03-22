#!/bin/bash

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io

# Add your user to the docker group to run Docker commands without sudo
sudo usermod -aG docker $USER

# Log out and log back in to apply the group membership changes
exit