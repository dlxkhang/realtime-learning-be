FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm ci 

COPY . .

EXPOSE 3300

RUN npm run build

CMD [ "node", "dist/bin/index.js" ]
