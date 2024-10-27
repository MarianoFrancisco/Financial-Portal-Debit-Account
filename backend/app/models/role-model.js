/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import { DataTypes } from 'sequelize';
import sequelize from '../../config/database-connection.js';

const Role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'roles',
    timestamps: false
});

export default Role;