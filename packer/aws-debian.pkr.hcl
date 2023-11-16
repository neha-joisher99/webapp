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
  default = ""
}

variable "DATABASE" {
  type    = string
  default = ""
}

variable "HOST" {
  type    = string
  default = ""
}


variable "PASSWORD" {
  type    = string
  default = ""
}

variable "ami_description" {
  type    = string
  default = null
}

variable "instance_type" {
  type    = string
  default = null
}
variable "device_name" {
  type    = string
  default = null
}


variable "volume_size" {
  type    = string
  default = null
}

variable "volume_type" {
  type    = string
  default = null
}

variable "provisioner_users_source" {
  type    = string
  default = null
}
 
variable "provisioner_users_destination" {
  type    = string
  default = null
}
 
variable "provisioner_webapp_source" {
  type    = string
  default = null
}
 
variable "provisioner_webapp_destination" {
  type    = string
  default = null
}
 
variable "provisioner_service_source" {
  type    = string
  default = null
}
 
variable "provisioner_service_destination" {
  type    = string
  default = null
}
 
variable "provisioner_shell_script" {
  type    = string
  default = null
}
 
variable "provisioner_config_source" {
  type    = string
  default = null
}
 
variable "provisioner_config_destination" {
  type    = string
  default = null
}


source "amazon-ebs" "debian-mywebapp" {
  // ami_users       = [577217829277, 784594104829]
  // ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  // ami_description = "Debian AMI for CSYE 6225"
  // instance_type   = "t2.micro"
  // region          = "${var.aws_region}"
  // source_ami      = "${var.source_ami}"
  // ssh_username    = "${var.ssh_username}"
  // subnet_id       = "${var.subnet_id}"
  // ssh_agent_auth  = false
    ami_users       = [577217829277, 784594104829]
    ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
    ami_description = "${var.ami_description}"
    instance_type   = "${var.instance_type}"
    region          = "${var.aws_region}"
    source_ami      = "${var.source_ami}"
    ssh_username    = "${var.ssh_username}"
    subnet_id       = "${var.subnet_id}"
    ssh_agent_auth  = false


  launch_block_device_mappings {
    // device_name           = "/dev/xvda"
    // delete_on_termination = true
    // volume_size           = 8
    // volume_type           = "gp2"
    device_name           = "${var.device_name}"
    delete_on_termination = true
    volume_size           = "${var.volume_size }"
    volume_type           = "${var.volume_type}"

  }
}

build {
  name    = "my-first-build"
  sources = ["source.amazon-ebs.debian-mywebapp"]

  // provisioner "file" {
  //   source      = "/home/runner/work/webapp/webapp/webapp1.zip"
  //   destination = "/home/admin/webapp1.zip"
  // }
  provisioner "file" {
    source      = "${var.provisioner_webapp_source}"
    destination = "${var.provisioner_webapp_destination}"
  }

  // provisioner "file" {
  //   source      = "users.csv"
  //   destination = "/home/admin/users.csv"
  // }
  
    provisioner "file" {
        source      = "${var.provisioner_users_source}"
        destination = "${var.provisioner_users_destination}"
  }

  // provisioner "file" {
  //   source      = "webapp.service"
  //   destination = "/home/admin/webapp.service"
  // }

    provisioner "file" {
      source      = "${var.provisioner_service_source}"
      destination = "${var.provisioner_service_destination}"
  }
 

  // provisioner "file" {
  //   source      = "/statsd/config.json"
  //   destination = "/home/admin/config.json"
  // }

    provisioner "file" {
        source      = "${var.provisioner_config_source}"
        destination = "${var.provisioner_config_destination}"
  }

  provisioner "shell" {
    //script = "./setup.sh"
      script ="${var.provisioner_shell_script}"
      environment_vars = [
      "PASSWORD=${var.PASSWORD}",
      "DATABASE=${var.DATABASE}",
      "USER=${var.USER}",
      "HOST=${var.HOST}"
    ]
  }


}

