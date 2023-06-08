"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit-message")
        .setDescription("Редактировать сообщение в указанном канала")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Канал в который необходимо редактировать сообщение")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option =>
            option
                .setName("messageid")
                .setDescription("ID сообщения которое нужно изменить")
                .setRequired(true)),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
        const messageId = interaction.options.getString("messageid");

        const modal = new ModalBuilder()
            .setCustomId(`${this.editMessageModalID}:${channel.id}:${messageId}`)
            .setTitle("Edit message");

        const msgText = new TextInputBuilder()
            .setCustomId(this.messageTextInputID)
            .setLabel("Message text")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(2000);

        const actionRow1 = new ActionRowBuilder()
            .addComponents(msgText);

        modal.addComponents(actionRow1);

        await interaction.showModal(modal);
    },

    editMessageModalID: "editmsg",
    messageTextInputID: "msgtext",
}