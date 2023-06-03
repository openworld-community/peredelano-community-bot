"use strict";
const { client } = require("../client");
const fetchAll = require("discord-fetch-all");
const {
    TextChannel,
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require("discord.js");
const { Message } = require("../database/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("collect-metrics")
        .setDescription("Коллектит сообщения со всех каналов"),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!["550493599629049858", "916653143130005514"].includes(interaction.user.id)) {
            await interaction.followUp({ content: "Не балуй!", ephemeral: true });
            return;
        }

        await exportAllMessages();

        await interaction.followUp({ content: "Метрики собраны.", ephemeral: true });
    },
}

async function exportAllMessages() {
    const guild = await client.guilds.fetch(process.env.SERVER_ID);

    await Message.destroy({
        where: {},
        truncate: true
    });

    const messages = [];
    for (const chan of guild.channels.cache.values()) {
        if (!(chan instanceof TextChannel)) continue;

        const chanMsgs = await fetchAll.messages(chan, {
            userOnly: true
        });

        for (const msg of chanMsgs) {
            const oldMsg = await Message.findByPk(msg.id);
            if (oldMsg) {
                oldMsg.content = msg.content;
                await oldMsg.save();
                continue;
            }

            const task = Message.create({
                id: msg.id,
                content: msg.content,
                timestamp: new Date(msg.createdTimestamp),
                user_id: msg.author.id,
                user_name: msg.author.username,
                channel_id: chan.id,
                channel_name: chan.name
            });
            messages.push(task);
        }

    }
    await Promise.all(messages);
}