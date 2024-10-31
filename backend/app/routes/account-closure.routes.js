/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    closeBankAccount,
    activateBankAccount
} from '../controllers/account-closure-controller.js';
import protect from '../middleware/protect-middleware.js';
import { administratorProtect } from '../middleware/role-protect-middleware.js';

const router = express.Router();

router.put('/:id/close', protect, administratorProtect, closeBankAccount);
router.put('/:id/activate', protect, administratorProtect, activateBankAccount);

export default router;
