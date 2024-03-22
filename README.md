### This branch is used to build and deploy a fullstack Javascript application in Jenkins.

# General information

It utilizes a custom jenkins build (it's the latest official version but I install some dependencies and set some permissions for jenkins user that's created by the official jenkins image), you can find the dockerfile in the jenkins folder.


# Docker

I've found attaching the socket to the containerized jenkins pretty handy, so I ran it like this: docker run -d -p 8080:8080 -p 50000:50000 -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home jenkins-with-nodejs


# Jenkins 

When jenkins is set up and running make sure to create the project as a "pipeline", and when configuring it specify the repository's branch (jenkins-deploy), as the other branches serve other test or deployment purposes.

You will also have to set up the MONGO_URI environment variable under Dashboard -> Manage Jenkins -> Credentials menu, since this is being referenced in the Jenkinsfile, but also the backend and frontend.

In the Jenkinsfile, you will most likely have to edit the URL's in the test stages. I used my host machine's local IP due to how the jenkins container and the pet project's containers use 2 separate networks (this is working due to how the host machine's ports are exposed).

If everything is set up the build, deployment, and db populate stages should all complete without any issues and you should be able to open the webpage at procecc.env.FRONTEND_URL.


# Troubleshooting tips

The most problems I've ran into were permission related. If you run into problems make sure to check that the user jenkins has the necessary dir and file permissions (such as ownership of the workspace you're creating, execute permission for docker-compose, etc.).

If during building jenkins runs into permission issues that denies it access to the docker daemon/socket/services you may have to force the 'docker' group inside the jenkins container to have the same ID as the docker group outside the container.

You can check the ID by running this command: cat /etc/group | grep docker
