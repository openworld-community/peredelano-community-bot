"use strict";
const { client } = require("./controllers");
require('dotenv').config();

const main = () => {
    client.login(process.env.TOKEN);
}
main();