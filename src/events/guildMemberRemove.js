"use strict";
const { Events, GuildMember } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
    },
};