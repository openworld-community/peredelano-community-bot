FROM node:18

COPY . /app

COPY ./.env /app

WORKDIR /app

RUN npm i -D sqlite3

RUN npm ci

RUN apt install sqlite3

RUN node /app/deploy.js

EXPOSE 8080

CMD ["node", "src/index.js"]
