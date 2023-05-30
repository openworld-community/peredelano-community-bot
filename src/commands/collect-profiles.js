"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    TextChannel,
    ChatInputCommandInteraction
} = require("discord.js");
const { CreatedChannel } = require("../database/model");
const { client } = require("../client");
const fetchAll = require('discord-fetch-all');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("collect-profiles")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription("Collect profiles to JSON"),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        /**
         * @type {TextChannel}
         */
        const chan = await client.channels.fetch("1109422632241201222");

        const rawMessages = await fetchAll.messages(chan);

        const results = [];
        for (const msg of rawMessages) {
            let member;
            try {
                member = await msg.guild.members.fetch(msg.author.id).catch(console.err);
            } catch (err) {
                console.log(`[ERROR] ${err}`);
            }
            let roles = [];
            if (member) {
                roles = member.roles.cache.map(role => role.name).filter(role => role != "@everyone");
                console.log(roles);
            }
            const processed = {
                "discord_id": msg.author.id,
                "discord_name": msg.author.username,
                "message_content": msg.content,
                "self_assigned_role": roles,
                "timestamp": msg.createdTimestamp
            };
            results.push(processed);
        }

        fs.writeFileSync("db/profiles.json", JSON.stringify(results));

        await interaction.editReply({ content: "Profiles collected successfully.", ephemeral: true });
    },
};