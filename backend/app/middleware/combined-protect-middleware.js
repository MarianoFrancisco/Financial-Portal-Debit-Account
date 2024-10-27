/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
import TokenLinkedApi from '../models/token-linked-api-model.js';

const combinedProtect = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') 
        ? req.headers.authorization.split(' ')[1] 
        : null;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    let user;

    try {
        const existingToken = await TokenLinkedApi.findOne({ where: { token } });
        if (existingToken) {
            const decodedToken = jwt.verify(token, process.env.API_ENCRIPTION_KEY);
            req.linkedAccounts = decodedToken.linkedAccounts;
            req.tokenID = existingToken.id;
            return next();
        }
    } catch {
    }

    try {
        const decoded = jwt.verify(token, process.env.ENCRYPTION_KEY);
        user = await User.findByPk(decoded.id, { attributes: { exclude: ['pin'] } });

        if (!user) {
            throw new Error('User not found.');
        }

        req.user = user;
        req.user_id = user.id;
        return next();
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Invalid authorization token.' });
    }
};

export default combinedProtect;
