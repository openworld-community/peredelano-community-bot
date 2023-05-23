"use strict";
const { Events } = require('discord.js');
const { client } = require("../client");

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState) {

        console.log(oldState);
        console.log(newState);
    }
};