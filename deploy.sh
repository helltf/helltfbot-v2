#!/bin/bash

set -e

npm i 

npm run build

cp .env ./dist

cd ./dist

pm2 restart helltfbot.js