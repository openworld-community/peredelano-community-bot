"use strict";
const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    Guild,
    ChatInputCommandInteraction
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Check information about the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("View guild information")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("role")
                .setDescription("View role information")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Role that you are viewing")
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

                console.log("GUILD FEATURES: ", guild.features);

                console.log("feature join: ");
                console.log(guild.features.length > 0
                    ? guild.features.join("\n")
                    : 'None')

                const embed = new EmbedBuilder()
                    .setTitle(guild.name)
                    .addFields(
                        { name: 'Guild Members', value: `${guild.memberCount}`, inline: true },
                        { name: 'Guild Channels', value: `${guild.channels.channelCountWithoutThreads} / 500`, inline: true },
                        { name: 'Guild Roles', value: `${guild.roles.cache.size} / 250`, inline: true },
                        {
                            name: 'Guild Features',
                            value: guild.features.length > 0
                                ? guild.features.join("\n")
                                : 'None'
                        },
                        { name: 'Guild Created At', value: `${guild.createdAt}` }
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