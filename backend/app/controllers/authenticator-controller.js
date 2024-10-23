/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import User from '../models/user-model.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    const { username, name, lastname, email, pin, phone, genre, active = 1, notifyme = 0 } = req.body;

    if (!username || !name || !email || !pin) {
        return res.status(400).json({ error: 'Required fields are missing.' });
    }

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
            notifyme
        });

        const dataToken = {
            id: user.id,
            username: user.username,
            name: user.name,
            lastname: user.lastname
        };

        const token = jwt.sign(dataToken, process.env.SECRET_KEY, { expiresIn: '5h' });

        res.status(201).json({ token });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Username or email is already in use.' });
        }
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const login = async (req, res) => {
    const { email, pin: enteredPin } = req.body;

    if (!email || !enteredPin) {
        return res.status(400).json({ message: 'Email and pin are required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await user.matchPassword(enteredPin);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect pin.' });
        }

        const dataToken = {
            id: user.id,
            username: user.username,
            name: user.name,
            lastname: user.lastname
        };

        const token = jwt.sign(dataToken, process.env.SECRET_KEY, { expiresIn: '5h' });

        res.json({ token });
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ message: 'Database error occurred.' });
        }

        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export { register, login };
