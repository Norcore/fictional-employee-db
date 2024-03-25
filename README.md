# General information

This project has multiple branches, they all have their README file, as the files and deployment may differ.

# Information about the branches.

Main branch is utilizing docker-compose to containerize both back and frontend.

Aws-s3-static branch is utilizing AWS EC2 for backend, AWS S3 bucket for static frontend, and MongoDB atlas for DB.

Jenkins and Jenkins-only-client branches were made for Jenkins freestyle project (or multibranch pipeline).

Jenkins-deploy branch is made for "pipeline project".

Kubernetes-minikube is utilizing and kubernetes minikube cluster.


# To start

### .env file
Create a .env file and ill up the environment variable for your personal mongodb connecttion url.

Connect to MongoDB in Compass (e.g: mongodb://localhost:27017/).

run "docker-compose up"

Once everything is set up, go to server/populate and run "node populate.js".
**populate command** will run the populate.js file as a script and it will generate a buch of starter data for your database. 

### Proxy

Watch for the port of your rest api. By default it will bind on port 8080 and the frontend proxy settings also depend on this configuration. If you for some reasons change the port of the backend, don't forget to change the ./client/package.json proxy settings as well.

And the create-react-app react-scripts package will start your frontend on the 3000 port and you can visit the http://localhost:3000 on your preferred browser.
