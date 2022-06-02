FROM node:13-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY package.json ./package.json

COPY html /app/html
COPY html/jsmpeg.min.js /app/html/jsmpeg.min.js

RUN npm install --silent
EXPOSE 5050

CMD ["npm", "start"]
