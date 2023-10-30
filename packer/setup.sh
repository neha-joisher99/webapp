#!/bin/bash
export DEBIAN_FRONTEND=noninteractive


sudo apt-get update
sudo apt-get upgrade -y

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

sudo apt-get install -y nodejs npm unzip 
sudo npm install -g nodemon

sudo mkdir /opt/csye6225/webapp
sudo mv /home/admin/webapp1.zip /opt/csye6225/webapp/
cd /opt/csye6225/webapp/
sudo unzip webapp1.zip
sudo npm audit fix
sudo npm install

source_path="/opt/csye6225/webapp/users.csv"
destination_path="/opt/"

# Move the file if it exists
[ -e "$source_path" ] && sudo mv "$source_path" "$destination_path" && echo "File 'users.csv' moved to '$destination_path'"

sudo mv /opt/csye6225/webapp/webapp.service /etc/systemd/system/webapp.service

sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 750 /opt/csye6225/

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp


