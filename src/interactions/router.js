"use strict";
const { Collection } = require("discord.js");
const { sendMessage } = require("./send-message");
const { sendEmbed } = require("./send-embed");
const { rolePick } = require("./role-pick");
const { sendMessageModalID } = require("../commands/send-message");
const { sendEmbedModalID } = require("../commands/send-embed");
const { rolePickerButtonID, rolePickerDropdownID } = require("../commands/create-role-picker");
const { pollButtonID, pollDropdownID } = require("../commands/create-poll");
const { registerPollAnswer } = require("./poll-answer");

const router = new Collection();

router.set(sendMessageModalID, sendMessage);
router.set(sendEmbedModalID, sendEmbed);
router.set(rolePickerButtonID, rolePick);
router.set(rolePickerDropdownID, rolePick);
router.set(pollButtonID, registerPollAnswer);
router.set(pollDropdownID, registerPollAnswer);

module.exports = {
    router: router,
};