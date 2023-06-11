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
    Message,
} = require("discord.js");
const { client } = require("../client");
const { Poll, sequelize } = require("../database/model");
const { QueryTypes } = require("sequelize");


const buttonsType = "buttons";
const dropdownType = "dropdown";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-poll")
        .setDescription("Создает опрос")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Тип интеракции в опросе")
                .setRequired(true)
                .addChoices(
                    { name: "Buttons", value: buttonsType },
                    { name: "Dropdown", value: dropdownType }
                ))
        .addStringOption(option =>
            option
                .setName("question")
                .setDescription("Вопрос, который будет задан пользователям")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("answers")
                .setDescription("Список возможных ответов, разделенные через ;")
                .setRequired(true))
        .addNumberOption(option =>
            option
                .setName("duration")
                .setDescription("Длительность опроса в минутах")
                .setRequired(true))
        .addBooleanOption(option =>
            option
                .setName("mention")
                .setDescription("Нужно ли упоминать @everyone"))
        .addBooleanOption(option =>
            option
                .setName("thread")
                .setDescription("Нужно ли создавать ветку под опросом"))
        .addNumberOption(option =>
            option
                .setName("maxanswers")
                .setDescription("Максимальное количество ответов (по-умолчанию 1)")),

    /**  
      * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const negativeRepl = () => interaction.reply({
            content: "Введите от 1 до до 20 ответов, разделенными через ;",
            ephemeral: true
        });

        const input = interaction.options.getString("answers");
        if (!input) return negativeRepl();

        const answers = Array.from(new Set(input.split(";").map(item => item.trim())));

        if (answers.length > 20) return negativeRepl();

        const type = interaction.options.getString("type");
        const maxAnswers = interaction.options.getNumber("maxanswers") ?? 1;
        const question = interaction.options.getString("question");
        const duration = interaction.options.getNumber("duration");
        const shouldMention = interaction.options.getBoolean("mention");
        const shouldCreateThread = interaction.options.getBoolean("thread");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Опрос от ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(question)
            .setFooter({
                text: `Длительность опроса - ${duration} минут. Максимальное количество ответов - ${maxAnswers}.`,
                iconURL: client.user.displayAvatarURL()
            });

        const components = new ActionRowBuilder();

        switch (type) {
            case buttonsType:
                const buttons = answers.map((answer, i) => new ButtonBuilder()
                    .setCustomId(`${this.pollButtonID}:${i}`)
                    .setLabel(answer)
                    .setStyle(ButtonStyle.Primary));

                components.addComponents(...buttons);

                break;
            case dropdownType:
                const options = answers.map((answer, i) => new StringSelectMenuOptionBuilder()
                    .setLabel(answer)
                    .setValue(`${i}`));

                const select = new StringSelectMenuBuilder()
                    .setCustomId(this.pollDropdownID)
                    .addOptions(...options)
                    .setMaxValues(maxAnswers);

                components.addComponents(select);

                break;
        }

        const pollMsg = await interaction.channel.send({
            content: shouldMention ? "@everyone" : undefined,
            embeds: [embed],
            components: [components]
        });

        if (shouldCreateThread) {
            pollMsg.startThread({ name: "Обсуждение опроса" });
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

        await interaction.reply({ content: "Опрос был успешно создан.", ephemeral: true });
    },
    closeExpiredPolls: closeExpiredPolls,
    pollButtonID: "poll-button",
    pollDropdownID: "poll-dropdown",
};

async function closeExpiredPolls() {
    const expiredPolls = await sequelize.query(`select * from polls where not is_expired and expired_at < Datetime();`, {
        type: QueryTypes.SELECT,
        model: Poll
    });

    for (const dto of expiredPolls) {
        const poll = dto.dataValues;

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

        const embed = new EmbedBuilder()
            .setTitle("Результаты опроса")
            .setDescription(poll.question)
            .addFields({ name: "Ответы", value: results });

        await msg.edit({ embeds: [embed], components: []});
    }
}