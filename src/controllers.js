"use strict";
const { client } = require("./client");
const { messageTextInputID, sendMessageModalID } = require("./commands/send-message");
const { sendEmbedModalID, embedJSONInputID } = require("./commands/send-embed");
const { rolePickerButtonID, rolePickerDropdownID } = require("./commands/create-role-picker");

const router = new Map();
router.set(sendMessageModalID, sendMessage);
router.set(sendEmbedModalID, sendEmbed);
router.set(rolePickerButtonID, rolePick);
router.set(rolePickerDropdownID, rolePick);

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

async function sendEmbed(interaction) {
    try {
        const msgJSON = interaction.fields.getTextInputValue(embedJSONInputID);
        const chanID = interaction.customId.split(":")[1];

        const chan = client.channels.cache.get(chanID);
        if (chan) {
            await chan.send({ embeds: [JSON.parse(msgJSON)] })
            await interaction.reply({
                content: `Message was successfully sent to ${chan.toString()}`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Channel does not exist!`,
                ephemeral: true
            });
            console.log(`Invalid channel ID: ${chanID}`);
        }
    } catch (e) {
        console.log(e);
        await interaction.reply({
            content: `An error occurred while executing command. Please check if the JSON entered is valid`,
            ephemeral: true
        });
    }
}

async function sendMessage(interaction) {
    try {
        const msgText = interaction.fields.getTextInputValue(messageTextInputID);
        const chanID = interaction.customId.split(":")[1];

        const chan = client.channels.cache.get(chanID);
        if (chan) {
            await chan.send(msgText)
            await interaction.reply({
                content: `Message was successfully sent to ${chan.toString()}`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Channel does not exist!`,
                ephemeral: true
            });
            console.log(`Invalid channel ID: ${chanID}`);
        }
    } catch (e) {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
}

module.exports = {
    client: client,
    router: router,
    sendMessage: sendMessage,
    sendEmbed: sendEmbed,
    rolePick: rolePick,
};