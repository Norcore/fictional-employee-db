### This branch is used to build and deploy a fullstack Javascript application in Jenkins.

# General information

The frontend is hosted as a static website in an AWS S3 bucket, the backend is hosted on an AWS EC2 ubuntu 22.04 LTS, and the DB is MongoDB Atlas.

# Requirements for Terraform

Need to create a dynamoDB table (in this project this is called "fictional-employee-db", if you use a different name you will have to modify the reference in the main.tf file as well), 2 AWS S3 buckets (1 for the static website, and another to store the statefile).


# Environment Variables/Secrets (Terraform)

See the variables.tf file.
The bucket and dynamodb table names are explicitly named in main.tf, that might have to be updated as well.

# Environment Variables/Secrets (Github)

AWS_ACCESS_KEY_ID
AWS_EC2_SG (ID)
AWS_REGION
AWS_SECRET_ACCESS_KEY
DOCKER_TOKEN
DOCKER_USER
MONGO_URI
REACT_APP_BACKEND_URL (The IP of the AWS EC2 you created beforehand)
REACT_APP_FRONTEND_URL (The address of the AWS S3 Bucket you created beforehand)
SSH_KEY

# AWS

The AWS S3 bucket has to be public, and under the 'Properties' menu "Static website hosting" has to be enabled (Bucket hosting).

# MongoDB Atlas

Once the AWS EC2 is up and running, the network access has to be configured in MongoDB Atlas.
Network Access -> Add IP Adress -> paste "ip/32".

# Troubleshooting tips

If the Github action workflow (/.github/workflows/ci-cd.yml file) goes past "Whitelist runner IP address" but fails before "Revoke runner IP address" run "terraform plan" again and see if the security group has to be reset before the next run (what happens is the Runner gets whitelisted but since the revoke step does not happen the runner remains on the list. Tried to implement 'if conditions' here but they all failed, will have to investigate more).