"use strict";
const { client } = require("./client");
const { initListeners } = require("./events");
require('dotenv').config();

const main = () => {
    initListeners();
    client.login(process.env.TOKEN);
}
main();