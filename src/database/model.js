"use strict";
const path = require("path");
const { Sequelize, Model, DataTypes } = require("sequelize");

const dbPath = path.join(__dirname, "../../db/db.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
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

module.exports = {
    sequelize: sequelize,
    CreatedChannel: CreatedChannel,
    TempChannel: TempChannel,
};