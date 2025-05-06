const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Overtime = sequelize.define('Overtime', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
    tableName: 'overtime',
});

module.exports = Overtime;
