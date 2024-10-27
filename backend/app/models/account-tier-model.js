/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import DataTypes from 'sequelize';
import sequelize from '../../config/database-connection.js';

const AccountTier = sequelize.define('account_tiers', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tier_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    opening_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'account_tiers',
    timestamps: false
});

export default AccountTier;
