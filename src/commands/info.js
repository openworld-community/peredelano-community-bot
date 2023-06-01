"use strict";
const {
    SlashCommandBuilder,
    EmbedBuilder,
    Guild,
    ChatInputCommandInteraction
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Просмотр информации")
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("Просмотр информации о сервере")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("role")
                .setDescription("Просмотр информации о роли")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Роль, информацию о которой вы хотите посмотреть")
                        .setRequired(true))
        ),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const command = interaction.options.getSubcommand();

        switch (command) {
            case "guild": {
                /**
                 * @type {Guild}
                 */
                const guild = interaction.guild;
                // Make sure that all roles are cached
                await guild.roles.fetch();

                const embed = new EmbedBuilder()
                    .setTitle(guild.name)
                    .addFields(
                        { name: 'Количество пользователей', value: `${guild.memberCount}`, inline: true },
                        { name: 'Количество созданных каналы', value: `${guild.channels.channelCountWithoutThreads} / 500`, inline: true },
                        { name: 'Количество ролей', value: `${guild.roles.cache.size} / 250`, inline: true },
                        {
                            name: 'Guild Features',
                            value: guild.features.length > 0
                                ? guild.features.join("\n")
                                : 'None'
                        },
                        { name: 'Дата создания сервера', value: `${guild.createdAt}` }
                    );

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }
            case "role": {
                const role = interaction.options.get("role");
                // TODO: add role information with pagination for role users
                break;
            }
        }
    }
};