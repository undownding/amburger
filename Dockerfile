FROM tzenderman/docker-nvm:latest AS builder

RUN apt-get update && apt-get install python3 python3-pip git cmake -y

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json .nvmrc ./
RUN /bin/bash -l -c "nvm install;" \
    "nvm use;"
RUN npm ci

COPY src ./src
COPY nest-cli.json tsconfig.* vite.*.ts ./
RUN npm run build:rollup

FROM tzenderman/docker-nvm:latest

#RUN apt-get update && apt-get install python3 python3-pip git cmake -y

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json .nvmrc ./
RUN /bin/bash -l -c "nvm install;" \
    "nvm use;"
RUN npm install --production

COPY --from=builder /app/dist ./dist

CMD node dist/main.mjs

EXPOSE 3000

