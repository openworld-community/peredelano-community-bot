"use strict";
const { Events, GuildChannel } = require('discord.js');

module.exports = {
    name: Events.ChannelDelete,
    /**
     * @param {GuildChannel} channel 
     */
    async execute(channel) {
    },
};