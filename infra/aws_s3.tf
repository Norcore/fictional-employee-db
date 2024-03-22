resource "aws_s3_bucket_acl" "fictional-employee-db" {
  bucket    = "${var.project_name}"
  acl       = "private"
}