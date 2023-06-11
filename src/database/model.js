"use strict";
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const dbPath = path.join(__dirname, "../../db/db.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
});


// Message сообщение в дискорде.
const Message = sequelize.define("discord_message", {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    channel_id: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    channel_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

// CreatedChannel канал от которого создаются подканалы.
const CreatedChannel = sequelize.define("created_channel", {
    channel_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true,
    },
    category_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
});

// TempChannel подканал созданный от CreatedChannel.
const TempChannel = sequelize.define("temp_channel", {
    channel_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

// PollAnswer ответ пользователя в опросе.
const PollAnswer = sequelize.define("poll_answer", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    poll_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    answer_number: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Poll опрос.
const Poll = sequelize.define("poll", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    message_id: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    channel_id: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    expired_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_expired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    number_of_answers: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    max_answers: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    answer_0: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    answer_1: {
        type: DataTypes.TEXT,
    },
    answer_2: {
        type: DataTypes.TEXT,
    },
    answer_3: {
        type: DataTypes.TEXT,
    },
    answer_4: {
        type: DataTypes.TEXT,
    },
    answer_5: {
        type: DataTypes.TEXT,
    },
    answer_6: {
        type: DataTypes.TEXT,
    },
    answer_7: {
        type: DataTypes.TEXT,
    },
    answer_8: {
        type: DataTypes.TEXT,
    },
    answer_9: {
        type: DataTypes.TEXT,
    },
    answer_10: {
        type: DataTypes.TEXT,
    },
    answer_11: {
        type: DataTypes.TEXT,
    },
    answer_12: {
        type: DataTypes.TEXT,
    },
    answer_13: {
        type: DataTypes.TEXT,
    },
    answer_14: {
        type: DataTypes.TEXT,
    },
    answer_15: {
        type: DataTypes.TEXT,
    },
    answer_16: {
        type: DataTypes.TEXT,
    },
    answer_17: {
        type: DataTypes.TEXT,
    },
    answer_18: {
        type: DataTypes.TEXT,
    },
    answer_19: {
        type: DataTypes.TEXT,
    },
});

module.exports = {
    sequelize: sequelize,
    CreatedChannel: CreatedChannel,
    TempChannel: TempChannel,
    Poll: Poll,
    PollAnswer: PollAnswer,
    Message: Message,
};