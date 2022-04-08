FROM node:16
WORKDIR /usr/helltfbot-v2
COPY package.json .
COPY tsconfig.json .

RUN npm install
RUN npm install typescript 
COPY . .
RUN npm run build


CMD ["node", "."]
