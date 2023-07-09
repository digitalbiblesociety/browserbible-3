FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

RUN apk add bash

COPY package*.json ./
ADD . .
RUN npm i && chmod -R 777 node_modules && npm cache clean -f && npm update && npm i -g typescript ts-node nodemon @nestjs/cli

# CMD [ "npm", "run" , "start:dev"]
CMD ["sleep", "infinity"]