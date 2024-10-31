/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
const administratorProtect = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: administrator privileges required' });
    }
};

const userProtect = (req, res, next) => {
    if (req.user && req.user.role_id === 2) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: client privileges required' });
    }
};

export {
    administratorProtect,
    userProtect
};
