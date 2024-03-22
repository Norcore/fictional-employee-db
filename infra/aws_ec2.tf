data "aws_ami" "amazon-linux-2" {
 most_recent = true
 owners      = ["amazon"]

 filter {
   name   = "owner-alias"
   values = ["amazon"]
 }


 filter {
   name   = "name"
   values = ["amzn2-ami-hvm-*-x86_64-ebs"]
 }
}


resource "aws_instance" "fictional-employee-db_server" {
 ami                         = "${data.aws_ami.amazon-linux-2.id}"
 associate_public_ip_address = true
 instance_type               = "t3.micro"
 key_name                    = "${var.ec2_keyname}"
 vpc_security_group_ids      = ["${aws_security_group.ec2_security_group_rnorbi.id}"]
 subnet_id                   = "${var.subnet_id_a}"

 tags = {
     Name                    = "${var.project_name}"
 }
}