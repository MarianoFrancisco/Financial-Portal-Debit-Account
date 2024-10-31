/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    getLinkedAccounts,
    getUserAccounts,
    updateAccountBalance,
    createBankAccount,
    changeAccountType,
    updateBankAccount
} from '../controllers/bank-account-controller.js';
import apiProtect from '../middleware/api-protect-middleware.js';
import protect from '../middleware/protect-middleware.js';
import { administratorProtect, userProtect } from '../middleware/role-protect-middleware.js';
import combinedProtect from '../middleware/combined-protect-middleware.js';

const router = express.Router();

router.get('/linked', apiProtect, getLinkedAccounts);
router.get('/user', protect, userProtect, getUserAccounts);
router.put('/update-balance', combinedProtect, updateAccountBalance);
router.put('/change-type', protect, administratorProtect, changeAccountType);
router.patch('/:account_id', protect, administratorProtect, updateBankAccount);
router.post('', protect, administratorProtect, createBankAccount);

export default router;