"use strict";
const path = require("path");
const fs = require("fs");
const {
    Events,
    Collection
} = require("discord.js");
const { client } = require("./client");

function initListeners() {
    client.once(Events.ClientReady, c => console.info(`[INFO] CLIENT STARTED AS ${c.user.tag}`));

    const commandPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

    client.commands = new Collection();

    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`[WARN] COMMAND WITHOUT DATA OR EXECUTE FUNCTION: ${filePath}`);
        }
    }

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

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
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isModalSubmit()) return;

        const parseRoute = (id) => id.split(":")[0];

        try {
            const route = parseRoute(interaction.customId);
            const controller = router.get(route);
            if (controller)
                await controller(interaction);
            else
                console.log(`[WARN] there is no command with ${route} customId`);
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = {
    initListeners: initListeners,
};