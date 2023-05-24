"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("startup")
        .setDescription("Create or manage startup channels")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Create startup category with channels")
                .addStringOption(option => option
                    .setName("name")
                    .setDescription("Startup name")
                    .setMaxLength(100)
                    .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add user to startup")
                .addChannelOption(option => option
                    .setName("category")
                    .setDescription("Startup category")
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true))
                .addUserOption(option => option
                    .setName("user")
                    .setDescription("User")
                    .setRequired(true))
                .addBooleanOption(option => option
                    .setName("addpermisions")
                    .setDescription("Add manage permissions to user?")
                    .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove user from startup")
                .addChannelOption(option => option
                    .setName("category")
                    .setDescription("Startup category")
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true))
                .addUserOption(option => option
                    .setName("user")
                    .setDescription("User")
                    .setRequired(true))
        ),

    async execute(interaction) {
        const command = interaction.options.getSubcommand();

        switch (command) {
            case "create": {
                console.log("create command");
                const category = await interaction.guild.channels.create({
                    name: interaction.options.get("name").value,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                            allow: [PermissionFlagsBits.Connect]
                        }
                    ]
                });

                await interaction.guild.channels.create({
                    name: "публичный-чат",
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        }
                    ]
                });

                await interaction.guild.channels.create({
                    name: "Публичный канал",
                    type: ChannelType.GuildVoice,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        }
                    ]
                });

                await interaction.guild.channels.create({
                    name: "командный-чат",
                    type: ChannelType.GuildText,
                    parent: category
                });

                await interaction.guild.channels.create({
                    name: "Командный канал",
                    type: ChannelType.GuildVoice,
                    parent: category
                });

                await interaction.reply({ content: "Startup channels created successfully.", ephemeral: true });
                break;
            }
            case "add": {
                const category = interaction.options.get("category");
                const user = interaction.options.get("user");
                const addPermissions = interaction.options.get("addpermisions");

                if (addPermissions.value) {
                    category.channel.permissionOverwrites.edit(user.value, {
                        ViewChannel: true,
                        ManageRoles: true,
                        ManageMessages: true,
                        ManageThreads: true,
                        MentionEveryone: true
                    });
                } else {
                    category.channel.permissionOverwrites.edit(user.value, {
                        ViewChannel: true
                    });
                }

                await interaction.reply({ content: "User successfully added to startup.", ephemeral: true });
                break;
            }
            case "remove": {
                const category = interaction.options.get("category");
                const user = interaction.options.get("user");

                category.channel.permissionOverwrites.delete(user.value);

                await interaction.reply({ content: "User successfully removed from startup.", ephemeral: true });
                break;
            }
        }
    },
};