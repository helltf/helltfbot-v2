#!/bin/bash

docker build -f ./Dockerfile . -t helltfbot-v2

docker run -d --network="host" --restart unless-stopped helltfbot-v2