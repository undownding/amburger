FROM debian:latest AS builder

SHELL ["/bin/bash", "--login", "-c"]

RUN apt-get update && apt-get install python3 python3-pip git cmake curl -y

RUN mkdir /app
WORKDIR /app

COPY .nvmrc ./
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
RUN nvm install; nvm use

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY nest-cli.json tsconfig.* vite.*.ts ./
RUN npm run build:rollup

FROM debian:latest

SHELL ["/bin/bash", "--login", "-c"]

RUN apt-get update && apt-get install curl -y

RUN mkdir /app
WORKDIR /app

COPY .nvmrc ./
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN nvm install; nvm use

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD node dist/main.mjs

EXPOSE 3000

