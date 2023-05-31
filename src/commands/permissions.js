"use strict";
const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ChannelType,
    TextChannel,
    VoiceChannel,
    ForumChannel
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("permissions")
        .setDescription("Добавить или убрать права у пользователя в указанном канале")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Добавить права выбранному пользователю в указанный канал")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Пользователь, которому нужно добавить права")
                        .setRequired(true))
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Канал, в который необходимо добавить права указанному пользователю")
                        .setRequired(true))
                .addBooleanOption(option =>
                    option
                        .setName("ismanager")
                        .setDescription("Добавить с правами менеджера?")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Убрать права у выбранного пользователя в указанном канале")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Пользователь, у которого нужно забрать права")
                        .setRequired(true))
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Канал, из которого необходимо убрать права")
                        .setRequired(true))),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const command = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user");
        /**@type {TextChannel | VoiceChannel | ForumChannel} */
        const channel = interaction.options.getChannel("channel");

        switch (command) {
            case "add": {
                const isManager = interaction.options.getBoolean("ismanager");

                channel.permissionOverwrites.edit(user, {
                    ViewChannel: true,
                    ManageRoles: isManager ? true : undefined,
                    ManageMessages: isManager ? true : undefined,
                    ManageThreads: isManager ? true : undefined,
                    MentionEveryone: isManager ? true : undefined,
                });

                await interaction.reply({ content: "Пользователю успешно выданы права.", ephemeral: true });
                break;
            }
            case "remove": {
                channel.permissionOverwrites.delete(user);

                await interaction.reply({ content: "У пользователя успешно забраны права.", ephemeral: true });
                break;
            }
        }
    },
};