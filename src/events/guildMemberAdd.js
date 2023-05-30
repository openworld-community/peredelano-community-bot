"use strict";
const { Events, GuildMember } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
    },
};