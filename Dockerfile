FROM node:20

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN node deploy.js

CMD ["node", "src/index.js"]
