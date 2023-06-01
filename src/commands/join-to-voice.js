"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join-to-voice")
        .setDescription("Присоединить бота к голосовому каналу")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => {
            return option
                .setName("channel")
                .setDescription("Голосовой канал, в который боту необходимо зайти")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        }),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        await interaction.reply({ content: "Бот успешно присоединился к голосовому каналу.", ephemeral: true });
    }
};