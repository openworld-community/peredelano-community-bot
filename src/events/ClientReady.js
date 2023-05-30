"use strict";
const { Events, Client } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.info(`[INFO] CLIENT STARTED AS ${client.user.tag}`);
    },
};
