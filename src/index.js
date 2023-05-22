"use strict";
const { client } = require("./client");
require('dotenv').config();

const main = () => {
    client.login(process.env.TOKEN);
}
main();