FROM node:18

COPY . /app

COPY ./.env /app

WORKDIR /app

RUN npm i -D sqlite3

RUN npm ci

RUN apt-get update && sudo apt-get upgrade

RUN apt-get install libsqlite3-dev

RUN node /app/deploy.js

EXPOSE 8080

CMD ["node", "src/index.js"]
