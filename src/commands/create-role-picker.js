"use strict";
const {
    SlashCommandBuilder
} = require("discord.js");
const { client } = require("../controllers");

const buttonsType = "buttons";
const dropdownType = "dropdown"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-role-picker")
        .setDescription("Creates a role picker to select the specified roles (max 25)")
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Role picker type")
                .setRequired(true)
                .addChoices(
                    { name: "Buttons", value: buttonsType },
                    { name: "Dropdown", value: dropdownType },
                ))
        .addStringOption(option =>
            option
                .setName("roles")
                .setDescription("List of roles separated by spaces (use @mention)")
                .setRequired(true),),

    async execute(interaction) {
        const type = interaction.options.getString("type");

        const negativeRepl = () => interaction.reply({
            content: "Enter 1 to 25 roles, separated by space",
            ephemeral: true
        });

        const input = interaction.options.getString("roles");
        if (!input)
            return await negativeRepl();

        const roles = input
            .split(" ")
            .map(item => {
                const m = item.match(/[0-9]+/);
                return m ? m[0] : "";
            }).filter(item => item.length);
        if (!roles.length || roles.length > 25)
            return await negativeRepl();

        console.log(client.guilds);

        switch (type) {
            case buttonsType:
                const buttons = roles.map(role => new ButtonBuilder()
                    .setCustomId(role.toLower())
                    .setLabel(role))



                break;
            case dropdownType:
                break;
        }

        await interaction.reply({
            content: "krasava",
            ephemeral: true
        });
    },

};