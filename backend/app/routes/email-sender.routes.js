/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import { pinReminder } from '../controllers/email-sender-controller.js';

const router = express.Router();

router.post('/pin-reminder', pinReminder);

export default router;
