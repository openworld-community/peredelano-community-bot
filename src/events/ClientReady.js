"use strict";
const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.info(`[INFO] CLIENT STARTED AS ${client.user.tag}`);
    },
};
