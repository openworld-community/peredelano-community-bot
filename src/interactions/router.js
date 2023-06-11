"use strict";
const { Collection } = require("discord.js");
const { editMessage } = require("./edit-message");
const { sendMessage } = require("./send-message");
const { rolePick } = require("./role-pick");
const { editMessageModalID } = require("../commands/edit-message");
const { sendMessageModalId } = require("../commands/send-message");
const { rolePickerButtonID, rolePickerDropdownID } = require("../commands/create-role-picker");
const { pollButtonID, pollDropdownID } = require("../commands/create-poll");
const { registerPollAnswer } = require("./poll-answer");

const router = new Collection();

router.set(editMessageModalID, editMessage);
router.set(sendMessageModalId, sendMessage);
router.set(rolePickerButtonID, rolePick);
router.set(rolePickerDropdownID, rolePick);
router.set(pollButtonID, registerPollAnswer);
router.set(pollDropdownID, registerPollAnswer);

module.exports = {
    router: router
};