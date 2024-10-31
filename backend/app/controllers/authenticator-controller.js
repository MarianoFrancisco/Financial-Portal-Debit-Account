/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import User from '../models/user-model.js';
import sequelize from '../../config/database-connection.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    const { username, name, lastname, email, pin, phone, genre, active = 1, notifyme = 0, role_id } = req.body;

    if (!username || !name || !email || !pin) {
        return res.status(400).json({ error: 'Required fields are missing.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const user = await User.create({
            username,
            name,
            lastname,
            email,
            pin,
            phone,
            genre,
            active,
            notifyme,
            role_id
        }, { transaction });

        const dataToken = {
            id: user.id,
            username: user.username,
            name: user.name,
            lastname: user.lastname
        };

        const token = jwt.sign(dataToken, process.env.ENCRYPTION_KEY, { expiresIn: '5h' });

        await transaction.commit();
        res.status(201).json({ token });
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Username or email is already in use.' });
        }
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
};

const login = async (req, res) => {
    const { username, pin } = req.body;

    if (!username || !pin) {
        return res.status(400).json({ message: 'Username and pin are required.' });
    }

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.active === 0) {
            return res.status(403).json({ message: 'User account is inactive.' });
        }

        const isMatch = await user.matchPassword(pin);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect pin.' });
        }

        const dataToken = {
            id: user.id,
            username: user.username,
            name: user.name,
            lastname: user.lastname
        };

        const token = jwt.sign(dataToken, process.env.ENCRYPTION_KEY, { expiresIn: '5h' });

        res.json({ token });
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ message: 'Database error occurred.' });
        }
        res.status(500).json({ message: 'Error during login: ' + error.message });
    }
};

export {
    register,
    login
};
