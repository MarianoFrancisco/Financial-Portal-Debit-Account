/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ENCRYPTION_KEY);

        const user = await User.findByPk(decoded.id, { attributes: { exclude: ['pin'] } });

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        req.user = user;
        req.user_id = user.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid authorization token.' });
    }
};

export default protect;
