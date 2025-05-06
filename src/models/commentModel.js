const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    comment: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
    tableName: 'comment',
});

module.exports = Comment;
