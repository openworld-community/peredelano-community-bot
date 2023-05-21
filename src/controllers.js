"use strict";
const path = require("path");
const fs = require("fs");
const {
    Client,
    Events,
    GatewayIntentBits,
    Collection
} = require("discord.js");
const { messageTextInputID, sendMessageModalID } = require("./commands/send-message");
const { sendEmbedModalID, embedJSONInputID } = require("./commands/send-embed");

const client = initClient();

const router = new Map();
router.set(sendMessageModalID, sendMessage);
router.set(sendEmbedModalID, sendEmbed);

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

function initClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ]
    });

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

    return client;
}

module.exports = {
    client: client,
    sendMessage: sendMessage,
};