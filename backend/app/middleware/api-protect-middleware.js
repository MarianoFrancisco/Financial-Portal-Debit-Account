/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import jwt from 'jsonwebtoken';
import TokenLinkedApi from '../models/token-linked-api-model.js';

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    const existingToken = await TokenLinkedApi.findOne({ where: { token } });
    if (!existingToken) {
        return res.status(401).json({ message: 'Invalid authorization token.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.API_ENCRIPTION_KEY);
        req.linkedAccounts = await decodedToken.linkedAccounts;
        req.tokenID = await existingToken.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid authorization token.' });
    }
};

export default protect;