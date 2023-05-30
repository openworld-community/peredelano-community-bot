"use strict";
const { Events, GuildBan } = require('discord.js');

module.exports = {
    name: Events.GuildBanRemove,
    /**
     * @param {GuildBan} ban 
     */
    async execute(ban) {
    },
};