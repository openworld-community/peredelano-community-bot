"use strict";
const {
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');
const { client } = require("../client");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave-from-voice")
        .setDescription("Commands the bot to leave from voice channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        if (connection)
            connection.destroy();

        await interaction.reply({ content: "Bot leaved from voice channel", ephemeral: true });
    }
};



