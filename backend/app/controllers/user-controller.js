/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import User from '../models/user-model.js';
import Role from '../models/role-model.js';
import sequelize from '../../config/database-connection.js';
import { encryptPin } from '../utils/encryption.js';

const getUser = async (req, res) => {
    const id = req.user_id;

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error retrieving user: ${error.message}` });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                'id', 'username', 'name', 'lastname', 'email', 'phone', 'genre', 'registration_date', 'notifyme', 'active',
                [sequelize.col('role.role_name'), 'role_name']
            ],
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: []
                }
            ]
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: `Error retrieving users: ${error.message}` });
    }
};

const changeUserActiveStatus = async (req, res) => {
    const { userId, activeStatus } = req.body;

    if (userId == null || activeStatus == null) {
        return res.status(400).json({ message: 'User ID and active status are required.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const [_, affectedRows] = await sequelize.query(
            `UPDATE users
            SET active = :activeStatus
            WHERE id = :userId`,
            {
                replacements: { activeStatus, userId },
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            }
        );

        if (affectedRows === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }

        await transaction.commit();
        return res.status(200).json({ message: 'User active status updated successfully.' });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Error updating user active status: ' + error.message });
    }
};

const changePin = async (req, res) => {
    const userId = req.user_id;
    const { oldPin, newPin } = req.body;

    if (!oldPin || !newPin) {
        return res.status(400).json({ message: 'Old and new PIN are required.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await user.matchPassword(oldPin);
        if (!isMatch) {
            await transaction.rollback();
            return res.status(401).json({ message: 'Old PIN does not match.' });
        }

        const encryptedNewPin = encryptPin(newPin);

        await sequelize.query(
            'UPDATE users SET pin = :newPin WHERE id = :userId',
            {
                replacements: { newPin: encryptedNewPin, userId },
                type: sequelize.QueryTypes.UPDATE,
                transaction
            }
        );

        await transaction.commit();
        return res.status(200).json({ message: 'PIN updated successfully.' });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Error changing PIN: ' + error.message });
    }
};

const updateUser = async (req, res) => {
    const userId = req.user_id;
    const { name, lastname, email, phone, notifyme } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const query = `
            UPDATE users
            SET name = :name, lastname = :lastname, email = :email, phone = :phone, notifyme = :notifyme
            WHERE id = :userId
        `;

        const [result] = await sequelize.query(query, {
            replacements: { name, lastname, email, phone, notifyme, userId },
            transaction,
        });

        if (result[1] === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'No se realizaron cambios o el usuario no fue encontrado.' });
        }

        const [updatedUser] = await sequelize.query('SELECT * FROM users WHERE id = :userId', {
            replacements: { userId },
            transaction,
        });

        await transaction.commit();
        return res.status(200).json({
            message: 'Perfil de usuario actualizado correctamente.',
            user: updatedUser[0]
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Error al actualizar el perfil del usuario: ' + error.message });
    }
};

export {
    getUser,
    getUsers,
    changeUserActiveStatus,
    changePin,
    updateUser
};
