import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
    const { username, name, lastname, email, pin, phone, genre, active, notifyme } = req.body;
    try {
        encripted_pin = await hashPassword(pin);
        const user = await User.create({
            username,
            name,
            lastname,
            email,
            pin: encripted_pin,
            phone,
            genre,
            registration_date: new Date(),
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
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, pin } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!bcrypt.compareSync(pin, user.pin)) {
            return res.status(401).json({ message: 'Incorrect pin' });
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
        res.status(500).json({ error: error.message });
    }
};

export { register, login };
