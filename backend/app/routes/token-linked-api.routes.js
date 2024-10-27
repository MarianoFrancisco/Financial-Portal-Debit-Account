/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import {
    createLinkAccount,
    updateLinkAccount,
    deleteLinkAccount
} from '../controllers/token-linked-api-controller.js';
import apiProtect from '../middleware/api-protect-middleware.js';

const router = express.Router();

router.post('/link-account', createLinkAccount);
router.put('/link-account', apiProtect, updateLinkAccount);
router.delete('/link-account', apiProtect, deleteLinkAccount);

export default router;