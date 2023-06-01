"use strict";
const {
    Events,
    PermissionsBitField,
    ChannelType,
    VoiceState,
    VoiceChannel,
    PermissionFlagsBits
} = require("discord.js");
const { client } = require("../client");
const {
    CreatedChannel,
    TempChannel
} = require("../database/model");

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    /**
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async execute(oldState, newState) {
        // юзер зашел в канал
        if (newState.channelId) {
            const tempChannel = await TempChannel.findByPk(oldState.channelId);
            if (tempChannel) {
                await handleLeaveFromTempChannel(tempChannel);
            }

            const createdChan = await CreatedChannel.findByPk(newState.channelId);
            if (!createdChan) return;

            const channel = client.channels.cache.get(newState.channelId);
            const user = newState.member.user;
            if (channel && user) {
                const category = newState.guild.channels.cache
                    .find(channel => channel.type == ChannelType.GuildCategory && channel.id == createdChan.category_id)

                const newChan = await newState.guild.channels.create({
                    name: user.username,
                    parent: category,
                    type: ChannelType.GuildVoice,
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: [
                                PermissionFlagsBits.ManageChannels,
                                PermissionFlagsBits.ManageRoles
                            ]
                        }
                    ],
                });

                await TempChannel.create({
                    channel_id: newChan.id,
                    category_id: category.id,
                    user_id: user.id,
                });

                await newState.member.voice.setChannel(newChan);
            }
        } else { // вышел из канала
            const tempChannel = await TempChannel.findByPk(oldState.channelId);
            if (!tempChannel) return;

            await handleLeaveFromTempChannel(tempChannel)
        }
    },
};

async function handleLeaveFromTempChannel(tempChannel) {
    /**
     * @type {VoiceChannel}
     */
    const chan = await client.channels.fetch(tempChannel.channel_id);
    if (chan && chan.members.size == 0)
        await chan.delete();
}