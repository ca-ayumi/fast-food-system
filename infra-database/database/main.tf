provider "aws" {
  region = var.aws_region
}

resource "aws_rds_instance" "db_instance" {
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "db.t3.micro"
  name                 = "fastfood"
  username             = var.db_username
  password             = var.db_password
  publicly_accessible  = false
  skip_final_snapshot  = true
  multi_az             = false
}
