"use strict";
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ChatInputCommandInteraction,
    Collection,
    Message
} = require("discord.js");
const { client } = require("../client");
const { Poll, PollAnswer, sequelize } = require("../database/model");
const { QueryTypes } = require("sequelize");
const { startJob } = require("../utils/job");


const buttonsType = "buttons";
const dropdownType = "dropdown";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-poll")
        .setDescription("Creates a pool.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Poll type.")
                .setRequired(true)
                .addChoices(
                    { name: "Buttons", value: buttonsType },
                    { name: "Dropdown", value: dropdownType },
                ))
        .addStringOption(option => option
            .setName("question")
            .setDescription("Poll question.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("answers")
            .setDescription("A list of answers separated by comma")
            .setRequired(true))
        .addNumberOption(option => option
            .setName("duration")
            .setRequired(true)
            .setDescription("Vote duration in minutes.")
            .setRequired(false))
        .addNumberOption(option => option
            .setName("maxanswers")
            .setDescription("Max answers.")),

    /**  
      * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const type = interaction.options.getString("type");

        const negativeRepl = () => interaction.reply({
            content: "Enter 1 to 20 answers, separated by semicolon.",
            ephemeral: true
        });

        const input = interaction.options.getString("answers");
        if (!input) return negativeRepl();

        const answers = Array.from(new Set(input.split(";").map(item => item.trim())));

        if (answers.length > 20) return negativeRepl();

        const maxAnswers = interaction.options.getNumber("maxanswers") > 0 ? interaction.options.getNumber("maxanswers") : 1;

        const question = interaction.options.getString("question");

        const duration = interaction.options.getNumber("duration");

        const embed = new EmbedBuilder()
            .setTitle("Опрос")
            .addFields(
                { name: "Вопрос", value: question },
                { name: "Длительность", value: `${duration} минут` },
                { name: "Максимальное количество ответов", value: `${maxAnswers}` },
            )
            .setFooter({ text: "Ваш ответ будет полностью анонимным." });

        /**
         * @type { Message }
         */
        let pollMsg;

        switch (type) {
            case buttonsType:
                const buttons = answers
                    .map((answer, i) => new ButtonBuilder()
                        .setCustomId(`${this.pollButtonID}:${i}`)
                        .setLabel(answer)
                        .setStyle(ButtonStyle.Primary));
                const row1 = new ActionRowBuilder()
                    .addComponents(...buttons);
                pollMsg = await client.channels.cache
                    .get(interaction.channelId)
                    .send({ embeds: [embed], components: [row1] });

                break;
            case dropdownType:
                const options = answers
                    .map((answer, i) => new StringSelectMenuOptionBuilder()
                        .setLabel(answer)
                        .setValue(`${i}`))
                const select = new StringSelectMenuBuilder()
                    .setCustomId(this.pollDropdownID)
                    .addOptions(...options)
                    .setMaxValues(maxAnswers);

                const row2 = new ActionRowBuilder()
                    .addComponents(select);
                pollMsg = await client.channels.cache
                    .get(interaction.channelId)
                    .send({ embeds: [embed], components: [row2] });

                break;
        }

        const now = new Date();

        const expired_at = new Date(now.setMinutes(now.getMinutes() + duration));

        const pollToCreate = {
            message_id: pollMsg.id,
            channel_id: pollMsg.channel.id,
            expired_at: expired_at,
            question: question,
            number_of_answers: answers.length,
            max_answers: maxAnswers,
        };

        for (let i = 0; i < answers.length; ++i) {
            pollToCreate[`answer_${i}`] = answers[i];
        }

        await Poll.create(pollToCreate);

        await interaction.reply({ content: "Poll has been successfully created", ephemeral: true });
    },
    closeExpiredPolls: closeExpiredPolls,
    pollButtonID: "poll-button",
    pollDropdownID: "poll-dropdown",
};

async function closeExpiredPolls() {
    const expiredPolls = await sequelize.query(`select * from polls where not is_expired and expired_at < Datetime();`, {
        logging: console.log,
        type: QueryTypes.SELECT,
        model: Poll
    });

    for (const dto of expiredPolls) {
        const poll = dto.dataValues;

        const maxAnswers = poll.max_answers;

        const chan = await client.channels.fetch(poll.channel_id);

        if (!chan) return;

        /**
         * @type {Message}
         */
        const msg = await chan.messages.fetch(poll.message_id);

        if (!msg) return;

        const counters = await sequelize.query(
            `select answer_number, count(*) from poll_answers where poll_id = ${poll.id} group by answer_number;`, {
            type: QueryTypes.SELECT
        });

        let pollModel = await Poll.findByPk(poll.id);
        if (pollModel) {
            pollModel.is_expired = true;
            pollModel = (await pollModel.save()).dataValues;
        }

        console.log("POLL MODEL: ", pollModel);

        const results = counters.reduce((str, item) => {
            const answer = pollModel[`answer_${item.answer_number}`];
            return str += `\`${item["count(*)"]} ${item["count(*)"] === 1 ? "ответ" : "ответов"}\`: ${answer}\n`;
        }, "");

        console.log("results_string: ", results);

        const embed = new EmbedBuilder().setTitle("Опрос").addFields(
            { name: "Вопрос", value: poll.question },
            { name: "Результаты", value: results },
        );

        await msg.delete()

        await chan.send({ embeds: [embed] });
    }
}