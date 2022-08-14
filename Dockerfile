FROM node:16
RUN rm -rf /usr/helltfbot-v2
WORKDIR /usr/helltfbot-v2

COPY . .

RUN yarn install

CMD ["yarn", "start"]
