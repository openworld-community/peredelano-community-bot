FROM node:18

COPY . /app

COPY ./.env /app

WORKDIR /app/src

RUN npm i -D sqlite3

RUN npm ci

RUN node /app/deploy.js

EXPOSE 8080

CMD ["node", "src/index.js"]
