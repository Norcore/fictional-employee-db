resource "aws_instance" "fictional-employee-db_server" {
  ami                         = "ami-023adaba598e661ac"
  associate_public_ip_address = true
  instance_type               = "t3.micro"
  key_name                    = "${var.ec2_keyname}"
  vpc_security_group_ids      = ["${aws_security_group.ec2_security_group_rnorbi.id}"]
  subnet_id                   = "${var.subnet_id_a}"

  tags = {
    Name = "${var.project_name}"
  }
}