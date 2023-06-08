"use strict";
const { Client, ActivityType } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
async function updateMembersCounter(client) {
    const guild = await client.guilds.fetch(process.env.SERVER_ID)
    const onlineMembers = guild.members.cache.filter(m => m.presence && m.presence.status === "online").size;
    await client.user.setActivity({
        type: ActivityType.Watching,
        name: `на ${guild.memberCount} пользователей\n${onlineMembers} онлайн`,
    });
}

module.exports = {
    updateMembersCounter: updateMembersCounter,
}