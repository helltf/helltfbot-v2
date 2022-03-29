#!/bin/bash

set -e

npm i 

tsc

cd ./dist

pm2 start helltfbot.js