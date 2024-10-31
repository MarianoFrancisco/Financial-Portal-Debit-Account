/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import { DataTypes } from 'sequelize';
import sequelize from '../../config/database-connection.js';
import Currency from './currency-model.js';

const ExchangeRate = sequelize.define('exchange_rates', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    origin_currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    destination_currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    rate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
    },
    last_update: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: Math.floor(Date.now() / 1000)
    },
}, {
    tableName: 'exchange_rates',
    timestamps: false,
});

Currency.hasMany(ExchangeRate, { foreignKey: 'origin_currency_id' });
Currency.hasMany(ExchangeRate, { foreignKey: 'destination_currency_id' });
ExchangeRate.belongsTo(Currency, { as: 'originCurrency', foreignKey: 'origin_currency_id' });
ExchangeRate.belongsTo(Currency, { as: 'destinationCurrency', foreignKey: 'destination_currency_id' });

export default ExchangeRate;
