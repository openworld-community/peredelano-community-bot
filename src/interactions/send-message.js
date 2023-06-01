"use strict";
const { messageTextInputID } = require("../commands/send-message");
const { client } = require("../client");

async function sendMessage(interaction) {
    try {
        const msgText = interaction.fields.getTextInputValue(messageTextInputID);
        const chanID = interaction.customId.split(":")[1];

        const chan = client.channels.cache.get(chanID);
        if (chan) {
            await chan.send(msgText)
            await interaction.reply({
                content: `Сообщение успешно отправлено в канал ${chan.toString()}.`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Канал не существует!`,
                ephemeral: true
            });
            console.log(`Invalid channel ID: ${chanID}`);
        }
    } catch (e) {
        console.error(`[ERROR] ${e}`);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
}

module.exports = {
    sendMessage: sendMessage,
};