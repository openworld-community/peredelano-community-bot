"use strict";
const { Events, Client } = require('discord.js');
const { startJob } = require("../utils/job");
const { updateMembersCounter } = require("../features/member-counter");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.info(`[INFO] CLIENT STARTED AS ${client.user.tag}`);
        startJob(updateMembersCounter.bind(this, client), 1000 * 60 * 30, "update_member_counter");
    },
};
