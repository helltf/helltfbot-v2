#!/bin/bash

set -e

npm i 

npm run build

sudo cp .env ./dist

pm2 restart helltfbot