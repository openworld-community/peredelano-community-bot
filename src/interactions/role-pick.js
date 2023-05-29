"use strict";
const { ButtonInteraction, SelectMenuInteraction } = require("discord.js");

/**
 * 
 * @param {ButtonInteraction | SelectMenuInteraction} interaction 
 * @returns {void}
 */
async function rolePick(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.isButton()) {
            const roleID = interaction.customId.split(":")[1];

            const role = interaction.guild.roles.cache.get(roleID);
            if (!role) {
                console.log(`[WARN] non-existent role ${roleID} is selected`);
                await interaction.followUp("selected role does not exist");
                return;
            }

            if (interaction.member.roles.cache.has(roleID)) {
                await interaction.member.roles.remove(role);
                await interaction.followUp({ content: `You successfully removed the role ${role.toString()}`, ephemeral: true });
            } else {
                await interaction.member.roles.add(role);
                await interaction.followUp({ content: `You successfully received the role ${role.toString()}`, ephemeral: true });
            }
        } else if (interaction.isStringSelectMenu()) {
            const selectedRoles = interaction.values
                .map(id => interaction.guild.roles.cache.get(id))
                .filter(role => role);

            const memberRoles = interaction.member.roles;

            const rolesToRemove = selectedRoles.filter(role => memberRoles.cache.has(role.id));
            const rolesToAdd = selectedRoles.filter(role => !memberRoles.cache.has(role.id));

            await Promise.all([
                rolesToRemove.forEach(role => memberRoles.remove(role)),
                rolesToAdd.forEach(role => memberRoles.add(role))
            ])

            const removedRoles = rolesToRemove.reduce((msg, role) => msg += `${role.toString()} `, "");
            const addedRoles = rolesToAdd.reduce((msg, role) => msg += `${role.toString()} `, "");

            if (removedRoles.length)
                await interaction.followUp({ content: `You successfully removed roles: ${removedRoles}`, ephemeral: true });
            if (addedRoles.length)
                await interaction.followUp({ content: `You successfully received roles: ${addedRoles}`, ephemeral: true });
        }
    } catch (e) {
        console.log(`[ERROR] ${e}`)
        await interaction.followUp({ content: `There was an error when selecting a role. Please check your permissions.`, ephemeral: true });
    }
}

module.exports = {
    rolePick: rolePick,
};