FROM node:20
WORKDIR /usr/helltfbot-v2

COPY package.json yarn.lock ./

RUN npm install

COPY . . 
EXPOSE 8090
CMD ["yarn", "start"]
