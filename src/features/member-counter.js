"use strict";
const { Client, ActivityType, PresenceStatus } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
async function updateMembersCounter(client) {
    const guild = await client.guilds.fetch(process.env.SERVER_ID)
    console.log("updateMembersCounter");
    const onlineMembers = guild.members.cache.filter(m => m.presence && m.presence.status === "online").size;
    await client.user.setActivity({
        type: ActivityType.Watching,
        name: `на ${guild.memberCount} пользователей\n${onlineMembers} онлайн`,
    });
}

module.exports = {
    updateMembersCounter: updateMembersCounter,
}