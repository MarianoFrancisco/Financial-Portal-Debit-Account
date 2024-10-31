import { DataTypes } from 'sequelize';
import sequelize from '../../config/database-connection.js';
import BankAccount from './bank-account-model.js';

const Transaction = sequelize.define('Transaction', {
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
    transaction_type: {
        type: DataTypes.ENUM('Income', 'Expense'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
    },
    transaction_date: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: Math.floor(Date.now() / 1000)
    },
}, {
    tableName: 'transactions',
    timestamps: false,
});

Transaction.belongsTo(BankAccount, { as: 'bankAccount', foreignKey: 'bank_account_id' });

export default Transaction;
