import axios from 'axios';
import paymentModel from '../model/paymentModel.js';
import { autoHeaderGen } from '../utils/autoHeaderGen.js';
import authTokens from '../model/authTokens.js';
import { v4 as uuidv4 } from 'uuid';


const create = async (req, res) => {
    const { amount } = req.body;

    try {
        const { data } = await axios.post(process.env.bkash_create_payment_url, {
            mode: '0011',
            payerReference: " ",
            callbackURL: 'http://localhost:5000/api/bkash/payment/callback',
            amount: amount,
            currency: "BDT",
            intent: 'sale',
            merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5)
        }, {
            headers: await autoHeaderGen()
        });
        return res.status(200).json({ bkashURL: data.bkashURL });
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }

}

const callback = async (req, res) => {
    const { paymentID, status } = req.query;

    if (status === 'cancel' || status === 'failure') {
        return res.redirect(`http://localhost:3000/bkash/error?message=${status}`);
    }
    if (status === 'success') {
        try {
            const { data } = await axios.post(process.env.bkash_execute_payment_url, { paymentID }, {
                headers: await autoHeaderGen()
            });
            if (data && data.statusCode === '0000') {
                await paymentModel.create({
                    userId: Math.random() * 10 + 1,
                    paymentID,
                    trxID: data.trxID,
                    date: data.paymentExecuteTime,
                    amount: parseInt(data.amount)
                });

                return res.redirect(`http://localhost:3000/bkash/success`);
            } else {
                return res.redirect(`http://localhost:3000/bkash/error?message=${data.statusMessage}`);
            }
        } catch (error) {
            console.log(error);
            return res.redirect(`http://localhost:3000/bkash/error?message=${error.message}`);
        }
    }
}

const refund = async (req, res) => {
    const { trxID } = req.params;

    try {
        const payment = await paymentModel.findOne({ trxID });

        const { data } = await axios.post(process.env.bkash_refund_transaction_url, {
            paymentID: payment.paymentID,
            amount: payment.amount,
            trxID,
            sku: 'payment',
            reason: 'cashback'
        }, {
            headers: await autoHeaderGen()
        });
        if (data && data.statusCode === '0000') {
            return res.status(200).json({ message: 'refund success' });
        } else {
            return res.status(404).json({ error: 'refund failed' });
        }
    } catch (error) {
        return res.status(404).json({ error: 'refund failed' });
    }
}

export {
    create,
    callback,
    refund
}
