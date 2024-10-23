/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import bcrypt from 'bcryptjs';

const { genSalt, hash: _hash } = bcrypt;

const hashPassword = async (password) => {
    try {
        const salt = await genSalt(10);
        const hash = await _hash(password, salt);
        return hash;
    } catch (err) {
        throw new Error('Password encryption error.');
    }
};

export default hashPassword;