FROM node:18

COPY . /app

COPY ./.env /app

WORKDIR /app

RUN npm i -D sqlite3

RUN npm ci

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install libsqlite3-dev -y

RUN node /app/deploy.js

EXPOSE 8080

CMD ["node", "src/index.js"]
