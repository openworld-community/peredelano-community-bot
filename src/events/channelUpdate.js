"use strict";
const { Events, GuildChannel } = require('discord.js');

module.exports = {
    name: Events.ChannelUpdate,
    /**
     * @param {GuildChannel} oldChannel 
     * @param {GuildChannel} newChannel 
     */
    async execute(oldChannel, newChannel) {
    },
};