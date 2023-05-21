"use strict";
const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send-message")
        .setDescription("Send a message to the specified channel")
        .addChannelOption(option => {
            return option
                .setName("channel")
                .setDescription("Text channel")
                .setRequired(true);
        }),

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");

        const modal = new ModalBuilder()
            .setCustomId(`${this.sendMessageModalID}:${channel.id}`)
            .setTitle("Send message");

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

    sendMessageModalID: "sendmsg",
    messageTextInputID: "msgtext",
}