packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.6"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-02b0c1b860ad092ee"
}

variable "USER" {
  type    = string
  default = "${env("USER")}"
}

variable "DATABASE" {
  type    = string
  default = "${env("DATABASE")}"
}

variable "PASSWORD" {
  type    = string
  default = "${env("PASSWORD")}"
}


source "amazon-ebs" "debian-mywebapp" {
  ami_users = [577217829277]
  //profile         = "${var.aws_profile}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "Debian AMI for CSYE 6225"
  instance_type   = "t2.micro"
  region          = "${var.aws_region}"
  source_ami      = "${var.source_ami}"
  ssh_username    = "${var.ssh_username}"
  subnet_id       = "${var.subnet_id}"
  ssh_agent_auth  = false

  launch_block_device_mappings {
    device_name           = "/dev/xvda"
    delete_on_termination = true
    volume_size           = 8
    volume_type           = "gp2"

  }
}

build {
  name    = "my-first-build"
  sources = ["source.amazon-ebs.debian-mywebapp"]

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/webapp1.zip"
    destination = "/home/admin/webapp1.zip"
  }

  provisioner "shell" {
    script = "./setup.sh"
    environment_vars = [
      "PASSWORD=${var.PASSWORD}",
      "DATABASE=${var.DATABASE}",
      "USER=${var.USER}"
    ]
  }


}

