"use strict";
const { ButtonInteraction, StringSelectMenuInteraction } = require("discord.js");
const { PollAnswer, Poll } = require("../database/model");

/**
 * @param { ButtonInteraction | StringSelectMenuInteraction } interaction 
 */
async function registerPollAnswer(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.isButton()) {
            const chanID = interaction.channel.id;
            const msgID = interaction.message.id;
            const userID = interaction.member.user.id;
            const answerNumber = interaction.customId.split(":")[1];

            console.log(`[registerPollAnswer] answer number: ${answerNumber}`);

            const poll = await Poll.findOne({
                where: {
                    channel_id: chanID,
                    message_id: msgID,
                    is_expired: false,
                }
            });

            if (!poll) {
                await interaction.followUp({ content: `Опрос уже прошел или был удален.`, ephemeral: true });
                return;
            }

            const oldAnswer = await PollAnswer.findOne({
                where: {
                    poll_id: poll.id,
                    user_id: userID,
                    answer_number: answerNumber
                }
            });

            if (oldAnswer) {
                await interaction.followUp({ content: `Вы уже поучаствовали в опросе.`, ephemeral: true });
                return;
            }

            const countAnswers = await PollAnswer.count({
                where: {
                    poll_id: poll.id,
                    user_id: userID,
                }
            });

            if (countAnswers >= poll.max_answers) {
                await interaction.followUp({ content: `Вы уже выбрали максимальное количество ответов.`, ephemeral: true });
                return;
            }

            await PollAnswer.create({
                poll_id: poll.id,
                answer_number: parseInt(answerNumber),
                user_id: userID,
            });

            const label = interaction.component.label;

            await interaction.followUp({ content: `Ваш голос за "${label}" успешно засчитан.`, ephemeral: true });

        } else if (interaction.isStringSelectMenu()) {
            const selectedAnswerNumbers = interaction.values;
            const chanID = interaction.channel.id;
            const msgID = interaction.message.id;
            const userID = interaction.member.user.id;

            console.log(`[registerPollAnswer] answer numbers: ${selectedAnswerNumbers}`);

            const poll = await Poll.findOne({
                where: {
                    channel_id: chanID,
                    message_id: msgID,
                    is_expired: false,
                }
            });
            if (!poll) {
                await interaction.followUp({ content: `Опрос уже прошел или был удален.`, ephemeral: true });
                return;
            }

            const maxAnswers = poll.max_answers;

            const oldAnswers = await PollAnswer.findAll({
                where: {
                    poll_id: poll.id,
                    user_id: userID,
                }
            });

            const newAnswers = selectedAnswerNumbers.filter(answer => !oldAnswers.some(item => parseInt(answer) === item.answer_number));

            if (newAnswers.length + oldAnswers.length > maxAnswers) {
                await interaction.followUp({ content: `Максимальное количество ответов в опросе: ${maxAnswers}`, ephemeral: true });
                return;
            }

            await Promise.all(newAnswers.map(answer_number => PollAnswer.create({
                poll_id: poll.id,
                answer_number: parseInt(answer_number),
                user_id: userID,
            })));

            await interaction.followUp({ content: `Ваши голос(а) успешно засчитаны.`, ephemeral: true });
        }
    } catch (err) {
        console.log(`[ERROR] registerPollAnswer: ${err}`);
        await interaction.followUp({ content: `Произошла ошибка при попытке засчитать голос. Попробуйте позже.`, ephemeral: true });
    }
}

module.exports = {
    registerPollAnswer: registerPollAnswer,
};


