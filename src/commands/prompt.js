"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-completion")
        .setDescription("Sends completion to GPT")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option
                .setName("prompt")
                .setDescription("Prompt")
                .setRequired(true)),

    /**  
     * @param {ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const input = interaction.options.getString("prompt");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", messages: [{ role: "assistant", content: normalizePrompt(input) }], stream: false
            })
        }).then(resp => resp.json());

        console.log(response.choices[0].message.content);

        const answer = response.choices[0].message.content.length >= 2000 ? response.choices[0].message.content.slice(0, 2000) : response.choices[0].message.content;

        await interaction.followUp(answer);
    }
};

const normalizePrompt = (prompt) => {
    return `Execute the instruction enclosed in <>, the answer must not be longer than 1800 characters.
    <${prompt}>`;
}