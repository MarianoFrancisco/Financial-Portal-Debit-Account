/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    register,
    login
} from '../controllers/authenticator-controller.js';
import { administratorProtect } from '../middleware/role-protect-middleware.js';

const router = express.Router();

router.post('/register', administratorProtect, register);
router.post('/login', login);

export default router;