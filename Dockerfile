#FROM ubuntu:16.04
FROM node:13-alpine
#RUN apt-get update
#RUN apt-get install -y python git-core curl build-essential openssl libssl-dev \
# && git clone https://github.com/nodejs/node.git \
# && cd node \
# && ./configure \
# && make \
# && sudo make install
#RUN apt-get install -y ffmpeg npm
#RUN apt-get upgrade -y
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
