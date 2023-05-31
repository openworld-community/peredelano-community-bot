"use strict";
const { Events, GuildBan } = require('discord.js');

module.exports = {
    name: Events.GuildBanAdd,
    /**
     * @param {GuildBan} ban 
     */
    async execute(ban) {
    },
};