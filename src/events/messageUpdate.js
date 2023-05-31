"use strict";
const { Events, Message } = require('discord.js');

module.exports = {
    name: Events.MessageUpdate,
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */
    async execute(oldMessage, newMessage) {
    },
};