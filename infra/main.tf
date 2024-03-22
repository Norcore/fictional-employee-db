  provider "aws" {
  profile   = "${var.aws_profile}"
  region    = "${var.aws_region}"
}

  terraform {
    required_version = "~> 1.0"
    backend "s3" {
    bucket         	   = "fictional-employee-db"
    key                = "statefile.tfstate"
    region         	   = "eu-central-1"
    encrypt        	   = true
    dynamodb_table = "fictional-employee-db"
  }
}