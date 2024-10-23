/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import DataTypes from 'sequelize';
import sequelize from '../../config/database-connection.js';  // Assuming you have a defined DB connection

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(65),
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(65),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    pin: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    genre: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
        defaultValue: 'Other'
    },
    registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    notifyme: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default User;
