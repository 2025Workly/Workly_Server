const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Stroed = sequelize.define('Stroed', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    contentId: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
    tableName: 'storedList',
});

module.exports = Stroed;
