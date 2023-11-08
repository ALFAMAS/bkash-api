import express from 'express';
import {
    create,
    callback,
    refund
} from './bkashController.js';

const router = express.Router();

router.post('/bkash/create', create);
router.post('/bkash/callback', callback);
router.post('/bkash/refund/:trxID', refund);

export default router;