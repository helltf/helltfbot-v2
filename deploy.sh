#!/bin/bash

set -e

npm i 

npm run build

cd ./dist

pm2 start helltfbot.js