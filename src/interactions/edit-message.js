"use strict";
const { messageTextInputID } = require("../commands/edit-message");
const { client } = require("../client");
const { ModalSubmitInteraction, TextBasedChannel } = require("discord.js");

/**
 * @param {ModalSubmitInteraction} interaction
 */
async function editMesssage(interaction) {
    const messageContent = interaction.fields.getTextInputValue(messageTextInputID);
    const params = interaction.customId.split(":");
    const channelId = params[1];
    const messageId = params[2];
    /**@type {TextBasedChannel} */
    const channel = await client.channels.fetch(channelId);

    if (channel === null) {
        await interaction.reply({ content: 'Указанный канал не найден.', ephemeral: true });
        return;
    }

    const messages = await channel.messages.fetch();
    const message = messages.get(messageId);

    if (message === undefined) {
        await interaction.reply({ content: 'Указанное сообщение не найдено.', ephemeral: true });
        return;
    }

    await message.edit({ content: messageContent });
    await interaction.reply({ content: 'Текст сообщения успешно изменен.', ephemeral: true });
}

module.exports = {
    editMesssage: editMesssage
};
