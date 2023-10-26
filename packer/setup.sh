#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y nodejs npm postgresql unzip 
sudo npm install -g nodemon

PASSWORD="${PASSWORD}"
DATABASE="${DATABASE}"
USER="${USER}"
HOST="${HOST}"

# echo "${USER}"
# echo "${DATABASE}"
# echo "${HOST}"
# echo "${PASSWORD}"

# # sudo groupadd csye6225
# # sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
# sudo -u postgres psql -c "CREATE USER ${USER} WITH PASSWORD '${PASSWORD}';"
# sudo -u postgres psql -c "CREATE DATABASE ${DATABASE};"
# sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DATABASE} TO ${USER};"
# sudo -u postgres psql <<EOF
# \c ${DATABASE}
# GRANT CREATE ON SCHEMA public TO ${USER};
# EOF

# sudo systemctl start postgresql
# sudo systemctl enable postgresql


sudo mkdir /opt/csye6225/
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

sudo cp /opt/csye6225/webapp/webapp.service /etc/systemd/system/webapp.service
cd /opt/csye6225/webapp/

sudo chown -R user:usergrp /opt/csye6225/
sudo chmod -R 750 /opt/csye6225/
systemctl daemon-reload
sudo systemctl enable csye6225
sudo systemctl start csye6225


