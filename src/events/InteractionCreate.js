"use strict";
const { Events } = require('discord.js');
const { router } = require("../interactions/router");

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(interaction);
        } else {
            await handleInteraction(interaction);
        }
    },
};

async function handleChatInputCommand(interaction) {
    console.log(interaction.commandName);

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`[ERROR] no command matching ${interaction.commandName} was found`)
    }

    try {
        await command.execute(interaction);
    } catch (e) {
        console.error(`[ERROR] ${e}`);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
}

async function handleInteraction(interaction) {
    const parseRoute = (id) => id.split(":")[0];

    try {
        console.log("ROUTER", router)
        const route = parseRoute(interaction.customId);
        const controller = router.get(route);
        if (controller)
            await controller(interaction);
        else
            console.log(`[WARN] there is no command with ${route} customId`);
    } catch (err) {
        console.log(err);
    }
}