#!/usr/bin/env bash

# Change bash color scheme
sed 's|DIR 01;34|DIR 01;33|' < /etc/DIR_COLORS > /home/vagrant/.dir_colors

# install nodejs/npm and dependencies
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
yum -y install nodejs
yum -y install gcc-c++ make

# we want to use express generator globally 
npm install express-generator -g

# Install mariadb
yum -y install mariadb-server

# Create users
`mysql -u root -e "Create Database accounts DEFAULT CHARACTER SET utf8;"`
`mysql --database=mysql -u root -e "create user 'manager'@'10.0.%' identified by 'Password123';"`
`mysql --database=mysql -u root -e "create user 'www'@'localhost' identified by 'Password123';"`
`mysql --database=mysql -u root -e "grant all privileges on *.* to 'manager'@'10.0.%';"`
`mysql --database=mysql -u root -e "grant select, insert, delete, execute, update on accounts.* to 'www'@'localhost';"`
`mysql -u root -e "flush privileges;"`