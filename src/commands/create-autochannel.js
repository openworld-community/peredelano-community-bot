"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    ChatInputCommandInteraction,
} = require("discord.js");
const { CreatedChannel } = require("../database/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-autochannel")
        .setDescription("Create autochannel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const category = await interaction.guild.channels.create({
            name: "Created channels",
            type: ChannelType.GuildCategory,
        });

        const channel = await interaction.guild.channels.create({
            name: "Created channel",
            type: ChannelType.GuildVoice,
            parent: category,
        });

        await CreatedChannel.create({
            channel_id: channel.id,
            category_id: category.id,
        });

        await interaction.reply({ content: "Voice channels created successfully.", ephemeral: true });
    },
};