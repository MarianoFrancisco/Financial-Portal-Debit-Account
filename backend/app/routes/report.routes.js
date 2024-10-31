/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    getAccountTransactions,
    getAllAccountTransactions,
    getFrozenAccounts,
    getAccountDetail,
    getAccountStatusSummary,
    getAccountClosures
} from  '../controllers/report-controller.js';
import protect from '../middleware/protect-middleware.js';
import { administratorProtect } from '../middleware/role-protect-middleware.js';

const router = express.Router();

router.get('/transactions/:account_id', protect, getAccountTransactions);
router.get('/transactions', protect, administratorProtect, getAllAccountTransactions);
router.get('/frozen-accounts', protect, administratorProtect,  getFrozenAccounts);
router.get('/account-detail/:account_number', protect, administratorProtect,  getAccountDetail);
router.get('/account-status-summary', protect, administratorProtect,  getAccountStatusSummary);
router.get('/account-closures', protect, administratorProtect,  getAccountClosures);

export default router;