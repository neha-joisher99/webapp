export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y nodejs npm postgresql unzip 
sudo npm install -g nodemon

sudo -u postgres psql -c "CREATE USER $USER WITH PASSWORD '$PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $DATABASE;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DATABASE TO nehajoisher;"
sudo -u postgres psql <<EOF
\c $DATABASE
GRANT CREATE ON SCHEMA public TO $USER;
EOF

sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo mkdir /home/admin/webapp
sudo mv /home/admin/webapp.zip /home/admin/webapp/
cd webapp/
sudo unzip webapp.zip
sudo npm audit fix
sudo npm install

