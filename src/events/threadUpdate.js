"use strict";
const { Events, ThreadChannel } = require('discord.js');

module.exports = {
    name: Events.ThreadUpdate,
    /**
     * @param {ThreadChannel} oldThread 
     * @param {ThreadChannel} newThread 
     */
    async execute(oldThread, newThread) {
    },
};