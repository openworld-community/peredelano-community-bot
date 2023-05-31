"use strict";
const { Events, Collection, Snowflake, Message, GuildTextBasedChannel } = require('discord.js');

module.exports = {
    name: Events.MessageDeleteBulk,
    /**
     * @param {Collection<Snowflake,Message>} messages 
     * @param {GuildTextBasedChannel} channel 
     */
    async execute(messages, channel) {
    },
};