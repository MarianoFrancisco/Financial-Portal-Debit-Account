/*
* @authors
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    getLinkedAccounts,
    updateAccountBalance
} from '../controllers/bank-account-controller.js';
import apiProtect from '../middleware/api-protect-middleware.js';
import protect from '../middleware/protect-middleware.js';

const router = express.Router();

router.get('/linked', apiProtect, getLinkedAccounts);
router.put('/update-balance', [apiProtect, protect], updateAccountBalance);

export default router;