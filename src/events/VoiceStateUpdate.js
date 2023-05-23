"use strict";
const { Events } = require('discord.js');
const { client } = require("../client");

module.exports = {
    name: Events.VoiceStateUpdate,
    execute(oldState, newState) {
    },
};