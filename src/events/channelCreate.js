"use strict";
const { Events, GuildChannel } = require('discord.js');

module.exports = {
    name: Events.ChannelCreate,
    /**
     * @param {GuildChannel} channel 
     */
    async execute(channel) {
    },
};
