"use strict";
const { Events, Invite } = require('discord.js');

module.exports = {
    name: Events.InviteCreate,
    /**
     * @param {Invite} invite 
     */
    async execute(invite) {
    },
};