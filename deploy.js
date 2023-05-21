"use strict";
require("dotenv").config();
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const token = process.env.TOKEN;
const appId = process.env.APP_ID;

const rest = new REST({ version: "10" }).setToken(token);

const commandPath = path.join(__dirname, "src/commands");
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

const commands = [];
for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log(`[INFO] STARTED LOADING ${commands.length} (/) COMMANDS`);

        const data = await rest.put(Routes.applicationCommands(appId), { body: commands });

        console.log(`[INFO] SUCCESFUL LOADED ${data.length} (/) commands`);
    } catch (e) {
        console.error(`[ERROR] ${e}`);
    }
})();

