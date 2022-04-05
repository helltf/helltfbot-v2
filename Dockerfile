FROM node:alpine
WORKDIR /usr/helltfbot-v2
COPY package.json .
COPY tsconfig.json .

RUN npm install\
    && npm install typescript -g
COPY . .
RUN npm run build

CMD ["node", "./dist/helltfbot.js"]