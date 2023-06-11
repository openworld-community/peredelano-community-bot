"use strict";
const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    PermissionFlagsBits,
    ChannelType,
    ChatInputCommandInteraction
} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("send-embed")
        .setDescription("Отправить embed-сообщение в указанный канал")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addChannelOption(option => 
            option
                .setName("channel")
                .setDescription("Канал в который необходимо отправить сообщение")
                .addChannelTypes(ChannelType.GuildText)),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;

        const modal = new ModalBuilder()
            .setCustomId(`${this.sendEmbedModalID}:${channel.id}`)
            .setTitle("Send message");

        const msgJSON = new TextInputBuilder()
            .setCustomId(this.embedJSONInputID)
            .setLabel("Generated JSON code from oldeb.nadeko.bot")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const actionRow1 = new ActionRowBuilder()
            .addComponents(msgJSON);

        modal.addComponents(actionRow1);

        await interaction.showModal(modal);
    },

    sendEmbedModalID: "sendembed",
    embedJSONInputID: "embedjson",
}