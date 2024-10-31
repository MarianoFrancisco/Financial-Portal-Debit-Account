/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import { DataTypes } from 'sequelize';
import sequelize from '../../config/database-connection.js';
import BankAccount from './bank-account-model.js';

const AccountClosure = sequelize.define('AccountClosure', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bank_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    closure_reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    closure_date: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: 'account_closures',
    timestamps: false,
});

AccountClosure.belongsTo(BankAccount, {
    foreignKey: 'bank_account_id',
    as: 'bankAccount',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export default AccountClosure;
