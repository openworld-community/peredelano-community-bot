"use strict";
const { Events, GuildMember } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    /**
     * @param {GuildMember} oldMember 
     * @param {GuildMember} newMember 
     */
    async execute(oldMember, newMember) {
    },
};