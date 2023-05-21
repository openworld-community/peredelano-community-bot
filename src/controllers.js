"use strict";
const { client } = require("./client");
const { messageTextInputID, sendMessageModalID } = require("./commands/send-message");
const { sendEmbedModalID, embedJSONInputID } = require("./commands/send-embed");
const { rolePickerButtonID } = require("./commands/create-role-picker");

const router = new Map();
router.set(sendMessageModalID, sendMessage);
router.set(sendEmbedModalID, sendEmbed);
router.set(rolePickerButtonID, rolePick);

async function rolePick(interaction) {
    const role = interaction.customId.split(":")[1];

    
}

async function sendEmbed(interaction) {
    try {
        const msgJSON = interaction.fields.getTextInputValue(embedJSONInputID);
        const chanID = interaction.customId.split(":")[1];

        const chan = client.channels.cache.get(chanID);
        if (chan) {
            await chan.send({ embeds: [JSON.parse(msgJSON)] })
            await interaction.reply({
                content: `Message was successfully sent to ${chan.toString()}`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Channel does not exist!`,
                ephemeral: true
            });
            console.log(`Invalid channel ID: ${chanID}`);
        }
    } catch (e) {
        console.log(e);
        await interaction.reply({
            content: `An error occurred while executing command. Please check if the JSON entered is valid`,
            ephemeral: true
        });
    }
}

async function sendMessage(interaction) {
    try {
        const msgText = interaction.fields.getTextInputValue(messageTextInputID);
        const chanID = interaction.customId.split(":")[1];

        const chan = client.channels.cache.get(chanID);
        if (chan) {
            await chan.send(msgText)
            await interaction.reply({
                content: `Message was successfully sent to ${chan.toString()}`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Channel does not exist!`,
                ephemeral: true
            });
            console.log(`Invalid channel ID: ${chanID}`);
        }
    } catch (e) {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
}

module.exports = {
    client: client,
    router: router,
    sendMessage: sendMessage,
    sendEmbed: sendEmbed,
};