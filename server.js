import express from 'express';
import mongoose from 'mongoose';
import body_parser from 'body-parser';
import dotEnv from 'dotenv';
import cors from 'cors';
import routes from './routes/routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
dotEnv.config();
app.use(body_parser.json());

app.use('/api', routes);

const db = async () => {
    try {
        await mongoose.connect(process.env.db_url);
        console.log('[*] Database Connection Successful');
    } catch (error) {
        console.log(error);
    }
};

const port = process.env.PORT;

app.get('/', (req, res) => res.send('[*] server is running'));

import bkashauth from './utils/bkashauth.js';

app.listen(port, () => {
    db();
    bkashauth();
    console.log(`[*] listening on port ${port}!`)
});