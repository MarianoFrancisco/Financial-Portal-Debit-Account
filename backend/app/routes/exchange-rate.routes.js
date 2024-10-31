/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    getExchangeRates,
    updateExchangeRate
} from '../controllers/exchange-rate-controller.js';
import protect from '../middleware/protect-middleware.js';
import { administratorProtect } from '../middleware/role-protect-middleware.js';

const router = express.Router();

router.get('', protect, getExchangeRates);
router.put('', protect, administratorProtect, updateExchangeRate);

export default router;
