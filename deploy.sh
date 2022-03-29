#!/bin/bash

set -e

npm i 

npm run build

cd ./dist

pm2 restart helltfbot.js