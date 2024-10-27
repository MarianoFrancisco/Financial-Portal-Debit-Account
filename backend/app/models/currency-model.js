/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import DataTypes from 'sequelize';
import sequelize from '../../config/database-connection.js';

const Currency = sequelize.define('currencies', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'currencies',
    timestamps: false
});

export default Currency;
