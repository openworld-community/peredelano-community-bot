"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    ChatInputCommandInteraction,
    TextChannel
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send-attachment")
        .setDescription("Отправить вложение")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addAttachmentOption(option =>
            option
                .setName("attachment")
                .setDescription("Вложение которое необходимо отправить")
                .setRequired(true))
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Канал в который необходимо отправить вложение")
                .addChannelTypes(ChannelType.GuildText)),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const attachment = interaction.options.getAttachment("attachment");
        /**@type {TextChannel | null | undefined} */
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;

        if (arguments === null || attachment === undefined) {
            await interaction.reply({ content: 'Не удалось обработать вложение, попробуйте еще раз.', ephemeral: true });
            return;
        }

        if (channel === null || channel === undefined) {
            await interaction.reply({ content: 'Не удалось получить канал, попробуйте еще раз.', ephemeral: true });
            return;
        }

        await channel.send({ files: [attachment] });
        await interaction.reply({ content: `Вложение успешно отправлено в канал ${channel.toString()}.`, ephemeral: true });
    }
}