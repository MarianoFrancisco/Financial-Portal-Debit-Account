import { DataTypes } from 'sequelize';
import sequelize from '../../config/database-connection.js';

const TokenLinkedApi = sequelize.define('tokens_linked_api', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'tokens_linked_api',
    timestamps: false,
});

export default TokenLinkedApi;
