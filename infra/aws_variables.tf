variable "aws_profile" {
    type    = string
    default = "default"
}

variable "aws_region" {
    type    = string
    default = "eu-central-1"
}

variable "project_name" {
    type    = string
    default = "fictional-employee-db"
}

variable "ami_id" {
    type = string
    default = "ami-023adaba598e661ac"
}

variable "vpc_id" {
    type    = string
    default = "vpc-0530f47401f40cea3"
}

variable "subnet_id_a" {
    type    = string
    default = "subnet-07b47df7130222066"
}

variable "subnet_id_b" {
    type    = string
    default = "subnet-08d3a85c6a6173953"
}

variable "subnet_id_c" {
    type    = string
    default = "subnet-02ee65aaad7388401"
}

variable "subnet_a_cidr" {
    type    = string
    default = "172.31.32.0/20"
}

variable "subnet_b_cidr" {
    type    = string
    default = "172.31.0.0/20"
}

variable "subnet_c_cidr" {
    type    = string
    default = "172.31.16.0/20"
}

variable "ec2_keyname" {
    type = string
    default = "euc1-keypair-rnorbi"
}