FROM jenkins/jenkins:lts
USER root

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_21.x | bash - && \
    apt-get install -y nodejs

# Install Docker prerequisites
RUN apt-get update && \
    apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

# Install Docker
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io && \
    usermod -aG docker jenkins

# Install Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Set working directory
WORKDIR /app
# Ensure workspace directory is writable by the Jenkins user
RUN chown -R jenkins:jenkins /app

# Install dependencies
RUN npm cache clean --force
RUN npm install -g react-scripts
RUN npm install compress-create-react-app
RUN npm install serve

# Install MongoDB client for Node.js
RUN npm install mongodb mongoose

# Install additional dependencies for server
RUN npm install dotenv cors express

RUN apt-get install zip

# Add Jenkins user to docker group
RUN usermod -aG docker jenkins

# Switch back to jenkins user
USER jenkins
