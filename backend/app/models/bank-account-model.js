/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import DataTypes from 'sequelize';
import sequelize from '../../config/database-connection.js';
import User from './user-model.js';
import AccountTier from './account-tier-model.js';
import Currency from './currency-model.js';

const BankAccount = sequelize.define('bank_accounts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    account_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    account_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    account_tier_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    balance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    creation_date: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: Math.floor(Date.now() / 1000)
    },
    is_delete: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'bank_accounts',
    timestamps: false
});

BankAccount.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
BankAccount.belongsTo(AccountTier, { foreignKey: 'account_tier_id', as: 'tier' });
BankAccount.belongsTo(Currency, { foreignKey: 'currency_id', as: 'currency' });

export default BankAccount;
