"use strict";
const { Client, ActivityType } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
async function updateMembersCounter(client) {
    const guild = await client.guilds.fetch(process.env.SERVER_ID)
    console.log("updateMembersCounter");
    await client.user.setActivity({
        type: ActivityType.Watching,
        name: `на ${guild.memberCount} пользователей`,
    });
}

module.exports = {
    updateMembersCounter: updateMembersCounter,
}