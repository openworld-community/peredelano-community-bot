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
        .setDescription("Отсоединиться ботом от голосового канала")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        if (connection)
            connection.destroy();

        await interaction.reply({ content: "Бот успешно отключился от голосового канала.", ephemeral: true });
    }
};



