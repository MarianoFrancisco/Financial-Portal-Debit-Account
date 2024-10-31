/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    getUser,
    changePin,
    updateUser
} from '../controllers/user-controller.js';
import protect from '../middleware/protect-middleware.js';

const router = express.Router();

router.get('', protect, getUser);

router.patch('/change-pin', protect, changePin);

router.patch('/update', protect, updateUser);

export default router;
