/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import DataTypes from 'sequelize';
import sequelize from '../../config/database-connection.js';
import hashPassword from '../utils/encryption.js';
import bcrypt from 'bcryptjs';

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
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: Math.floor(Date.now() / 1000)
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
    tableName: 'user',
    timestamps: false,
    hooks: {
        beforeSave: async (user) => {
            if (user.pin) {
                user.pin = await hashPassword(user.pin);
            }
        }
    }
});

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.pin);
};

export default User;
