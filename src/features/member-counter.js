"use strict";
const { Client, ActivityType } = require("discord.js");

/**
 * @param {Client} client 
 */
async function updateMembersCounter(client) {
    const guild = await client.guilds.fetch(process.env.SERVER_ID);
    const guildMembers = await guild.members.fetch({ force: true });
    const onlineMembers = guildMembers.filter(member => member.presence !== null && member.presence.status !== "offline");

    client.user.setActivity(
        `на ${guildMembers.size} пользователей, ${onlineMembers.size} из них онлайн`,
        { type: ActivityType.Watching });
}

module.exports = {
    updateMembersCounter: updateMembersCounter
}