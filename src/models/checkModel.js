const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Check = sequelize.define('Check', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    checked: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    userId: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
    tableName: 'checkList',
});

module.exports = Check;
