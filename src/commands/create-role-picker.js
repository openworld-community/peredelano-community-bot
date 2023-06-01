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
        .setDescription("Создает интерфейс выбора указанных ролей (максимум 25)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Тип интеракции")
                .setRequired(true)
                .addChoices(
                    { name: "Buttons", value: buttonsType },
                    { name: "Dropdown", value: dropdownType },
                ))
        .addStringOption(option =>
            option
                .setName("roles")
                .setDescription("Список ролей, разделенный пробелом (используйте @упоминание)")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("msgtext")
                .setDescription("Текстовое сообщение над интерфейсом выбора ролей")
                .setRequired(false))
        .addNumberOption(option =>
            option
                .setName("limit")
                .setDescription("Выберите максимальное количество ролей, которые можно выбрать (только для выпадающего списка)")
                .setRequired(false)
                .setMinValue(0)),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const type = interaction.options.getString("type");

        const negativeRepl = () => interaction.reply({
            content: "Введите от 1 до 25 ролей, разделенные пробелом.",
            ephemeral: true
        });

        const input = interaction.options.getString("roles");
        if (!input) return negativeRepl();


        const guild = client.guilds.cache.get(interaction.guildId);

        const roles = Array
            .from(new Set(input.split(" ")))
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

                const rows = sliceIntoChunks(buttons, 5)
                    .map(buttons => new ActionRowBuilder()
                        .addComponents(...buttons));

                await client.channels.cache.get(interaction.channelId).send({ content: msgtext, components: rows });
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
        await interaction.reply({ content: "Интерфейс для выбора ролей успешно создан.", ephemeral: true });
    },
    rolePickerButtonID: "role-picker-button",
    rolePickerDropdownID: "role-picker-dropdown"
};

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}
