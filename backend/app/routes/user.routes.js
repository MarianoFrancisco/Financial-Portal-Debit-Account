/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    getUser,
    getUsers,
    changeUserActiveStatus,
    changePin,
    updateUser
} from '../controllers/user-controller.js';
import protect from '../middleware/protect-middleware.js';
import { administratorProtect } from '../middleware/role-protect-middleware.js';

const router = express.Router();

router.get('/single', protect, getUser);

router.get('', protect, administratorProtect, getUsers);

router.patch('/status', protect, administratorProtect, changeUserActiveStatus);

router.patch('/change-pin', protect, changePin);

router.patch('/update', protect, updateUser);

export default router;
