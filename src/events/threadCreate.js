"use strict";
const { Events, ThreadChannel } = require('discord.js');

module.exports = {
    name: Events.ThreadCreate,
    /**
     * @param {ThreadChannel} thread 
     * @param {boolean} newlyCreated 
     */
    async execute(thread, newlyCreated) {
    },
};