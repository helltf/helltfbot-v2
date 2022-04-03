#!/bin/bash

set -e

pm2 stop helltfbot

npm i 

npm install typescript

npm run build

sudo cp .env ./dist

pm2 restart helltfbot