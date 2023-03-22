FROM node:19 AS builder

RUN apt-get update && apt-get install python3 python3-pip git cmake -y

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY nest-cli.json tsconfig.* ./
RUN npm build

FROM node:19

RUN apt-get update && apt-get install python3 python3-pip git cmake -y

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

CMD node dist/main.js

EXPOSE 3000

