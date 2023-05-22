"use strict";
const { Collection } = require("discord.js");
const { sendMessage } = require("./send-message");
const { sendEmbed } = require("./send-embed");
const { rolePick } = require("./role-pick");
const { sendMessageModalID } = require("../commands/send-message");
const { sendEmbedModalID } = require("../commands/send-embed");
const { rolePickerButtonID, rolePickerDropdownID } = require("../commands/create-role-picker");

const router = new Collection();

router.set(sendMessageModalID, sendMessage);
router.set(sendEmbedModalID, sendEmbed);
router.set(rolePickerButtonID, rolePick);
router.set(rolePickerDropdownID, rolePick);

module.exports = {
    router: router,
};