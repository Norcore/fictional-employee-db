This branch is used to build the frontend in Jenkins.

There are two ways to use this branch:
    1: containerized version:
        - for the containerized version use "docker-compose up" as "build step" (execute shell)
            - if you want your container to immediately shut down and be removed after testing you can also add "docker-compose down" after "docker-compose up"
    2: non-containerized version:
        -     • build steps:
                ○ "execute shell":
                    § cd client
                    § npm cache clean --force
                    § npm install
                    § npm react-scripts react-router-dom
                    § export CI=false -> makes it so that jenkins build ignores eslint warnings
                    § npm run build
                ○ in a separate build step choose "file operations" (this is a plugin you have to install in jenkins)
                    § folder path: client/build/
                    § output folder path: ./
            • post-build actions: 
        archive the artifacts: build.zip