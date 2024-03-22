resource "aws_security_group" "ec2_security_group_rnorbi" {
  name        = "ec2-security-group-terraform-rnorbi"
  description = "Security group for EC2 instance"
  vpc_id      = "${var.vpc_id}"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["84.0.255.119/32"]
  }

}
