#!/usr/bin/env bash

# Change bash color scheme
sed 's|DIR 01;34|DIR 01;33|' < /etc/DIR_COLORS > /home/vagrant/.dir_colors

# install nodejs/npm and dependencies
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
yum -y install nodejs
yum -y install gcc-c++ make

# we want to use express generator globally 
npm install express-generator -g
