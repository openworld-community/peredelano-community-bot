"use strict";
const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    PermissionFlagsBits
} = require("discord.js");
const { client } = require("../client");

const buttonsType = "buttons";
const dropdownType = "dropdown"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-role-picker")
        .setDescription("Creates a role picker to select the specified roles (max 25)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("msgtext")
                .setDescription("Text for message with role-picker")
                .setRequired(false))
        .addNumberOption(option =>
            option
                .setName("limit")
                .setDescription("Number of roles that can be selected (only for the dropdown list)")
                .setRequired(false)
                .setMinValue(0)),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const type = interaction.options.getString("type");

        const negativeRepl = () => interaction.reply({
            content: "Enter 1 to 25 roles, separated by space",
            ephemeral: true
        });

        const input = interaction.options.getString("roles");
        if (!input) return negativeRepl();


        const guild = client.guilds.cache.get(interaction.guildId);

        const roles = input
            .split(" ")
            .map(item => {
                const m = item.match(/[0-9]+/);
                return m ? m[0] : "";
            }).filter(item => guild.roles.cache.has(item));

        if (!roles.length || roles.length > 25) return negativeRepl();

        const msgtext = interaction.options.getString("msgtext");

        switch (type) {
            case buttonsType:
                const buttons = roles.map(roleID => new ButtonBuilder()
                    .setCustomId(`role-picker-button:${roleID}`)
                    .setLabel(guild.roles.cache.get(roleID).name)
                    .setStyle(ButtonStyle.Primary));
                const row1 = new ActionRowBuilder()
                    .addComponents(...buttons);
                await client.channels.cache.get(interaction.channelId).send({ content: msgtext, components: [row1] });
                break;
            case dropdownType:
                const limit = interaction.options.getNumber("limit");
                const options = roles.map(roleID => new StringSelectMenuOptionBuilder()
                    .setLabel(guild.roles.cache.get(roleID).name)
                    .setValue(roleID))
                const select = new StringSelectMenuBuilder()
                    .setCustomId(this.rolePickerDropdownID)
                    .addOptions(...options);

                if (limit > 0) select.setMaxValues(limit);
                else select.setMaxValues(1);

                const row2 = new ActionRowBuilder()
                    .addComponents(select);
                await client.channels.cache.get(interaction.channelId).send({ content: msgtext, components: [row2] });
                break;
        }
        await interaction.reply({ content: "Role picker created successfully.", ephemeral: true });
    },
    rolePickerButtonID: "role-picker-button",
    rolePickerDropdownID: "role-picker-dropdown"
};