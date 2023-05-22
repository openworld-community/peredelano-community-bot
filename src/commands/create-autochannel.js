"use strict";
const {
    SlashCommandBuilder,
} = require("discord.js");
const { client } = require("../client");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-autochannel"),

    async execute() {

    }
};