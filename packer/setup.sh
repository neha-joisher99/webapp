#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y nodejs npm postgresql unzip 
sudo npm install -g nodemon

PASSWORD="${PASSWORD}"
DATABASE="${DATABASE}"
USER="${USER}"
HOST="${HOST}"

export PASSWORD
export DATABASE
export USER
export HOST

echo "${USER}"
echo "${DATABASE}"
echo "${HOST}"

sudo -u postgres psql -c "CREATE USER ${USER} WITH PASSWORD '${PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE ${DATABASE};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DATABASE} TO ${USER};"
sudo -u postgres psql -c "\\c ${DATABASE}"
sudo -u postgres psql -c "GRANT CREATE ON SCHEMA public TO ${USER};"

sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo mkdir /home/admin/webapp
sudo mv /home/admin/webapp1.zip /home/admin/webapp/
cd webapp/
sudo unzip webapp1.zip

source_path="/home/admin/webapp/users.csv"
destination_path="/opt/"

# Move the file if it exists
[ -e "$source_path" ] && sudo mv "$source_path" "$destination_path" && echo "File 'users.csv' moved to '$destination_path'"

sudo npm audit fix
sudo npm install


