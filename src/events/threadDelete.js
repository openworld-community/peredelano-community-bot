"use strict";
const { Events, ThreadChannel } = require('discord.js');

module.exports = {
    name: Events.ThreadDelete,
    /**
     * @param {ThreadChannel} thread 
     */
    async execute(thread) {
    },
};