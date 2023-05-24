"use strict";
const path = require("path");
const fs = require("fs");
const {
    Collection
} = require("discord.js");
const { client } = require("./client");
const db = require("./database/model");

const main = async () => {
    require("dotenv").config();

    await db.sequelize.authenticate();
    await db.sequelize.sync();

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

    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        console.log(event.name);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args).then(console.error));
        } else {
            client.on(event.name, (...args) => event.execute(...args).then(console.error));
        }
    }

    client.login(process.env.TOKEN);
}
main();