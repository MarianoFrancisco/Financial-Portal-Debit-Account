/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authenticator-controller.js';

router.post('/register', register);
router.post('/login', login);

export default router;