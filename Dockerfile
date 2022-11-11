FROM node:16
WORKDIR /usr/helltfbot-v2

COPY package.json yarn.lock ./

RUN yarn install

COPY . . 
EXPOSE 8090
CMD ["yarn", "start"]
