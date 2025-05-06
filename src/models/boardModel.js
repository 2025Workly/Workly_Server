const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Board = sequelize.define('Board', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tag: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
    tableName: 'board',
});

module.exports = Board;
