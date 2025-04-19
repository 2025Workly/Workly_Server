const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Sequelize 인스턴스

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    pass: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
}, {
    timestamps: true,  // createdAt, updatedAt 자동 생성
    tableName: 'users'
});

module.exports = User;
