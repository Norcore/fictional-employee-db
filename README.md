# To start things

Create a minikube cluster (e.g: minikube start --profile=<insert-desired-name>).
Once the kluster is up you can double check the current context to make sure (kubectl config current-context).

Apply the kubernetes manifest files, and wait for everything to set up (you can check the status of your cluster by running "kubectl get all").

## Server side

### .env file
Copy the .env.sample as .env and fill up the environment variable for your personal mongodb connecttion url.

### Prepare the database

connect to one of the servers in the kubernetes cluster (e.g: kubectl exec -it <insert-server-name-here> -- /bin/sh),
then run the populate.js file.

**populate command** will run the populate.js file as a script and it will generate a buch of starter data for your database. 

### Running the code

kubectl port-forward svc/fictional-employee-db-server 3001:3001

It will forward the service to the specified port.



## Client side


### Runnig the code

kubectl port-forward svc/fictional-employee-db-client 3000:3000

Will forward your frontend on the 3000 port and you can visit the http://localhost:3000 on your preferred browser.
