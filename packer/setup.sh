export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y nodejs npm postgresql unzip 
sudo npm install -g nodemon

echo "USER: $USER"
echo "PASSWORD: $PASSWORD"
echo "DATABASE: $DATABASE"
sudo -u postgres psql -c "CREATE USER nehajoisher WITH PASSWORD 'neha';"
sudo -u postgres psql -c "CREATE DATABASE $DATABASE;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DATABASE TO nehajoisher;"
sudo -u postgres psql <<EOF
\c $DATABASE
GRANT CREATE ON SCHEMA public TO nehajoisher;
EOF

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


