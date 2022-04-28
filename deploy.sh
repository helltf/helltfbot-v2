#!/bin/bash
docker stop helltfbot-v2
docker rm helltfbot-v2

docker build -f ./Dockerfile . -t helltfbot-v2

docker run -d --restart unless-stopped --network="host" --name helltfbot-v2 helltfbot-v2