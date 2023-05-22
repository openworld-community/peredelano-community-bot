"use strict";
const { client } = require("../client");
const { embedJSONInputID } = require("../commands/send-embed");

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

module.exports = {
    sendEmbed: sendEmbed,
};