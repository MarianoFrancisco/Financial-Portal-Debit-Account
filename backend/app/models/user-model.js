/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import DataTypes from 'sequelize';
import sequelize from '../../config/database-connection.js';
import Role from './role-model.js';
import { encryptPin, decryptPin } from '../utils/encryption.js';

const User = sequelize.define('users', {
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
        allowNull: true,
        defaultValue: ""
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
        allowNull: true,
        defaultValue: ""
    },
    genre: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
        defaultValue: 'Other'
    },
    registration_date: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: Math.floor(Date.now() / 1000)
    },
    active: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    notifyme: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeSave: async (user) => {
            if (user.pin) {
                user.pin = encryptPin(user.pin);
            }
        }
    }
});


User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id' });

User.prototype.matchPassword = async function (enteredPassword) {
    const decryptedPin = decryptPin(this.pin);
    return enteredPassword === decryptedPin;
};

export default User;
