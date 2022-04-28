#!/bin/bash
docker rm $(docker stop $(docker ps -a -q --filter ancestor=helltfbot-v2 --format="{{.ID}}"))

docker build -f ./Dockerfile . -t helltfbot-v2

docker run -d --restart unless-stopped --network="host" helltfbot-v2