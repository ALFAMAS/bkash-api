import axios from 'axios';
import authTokens from '../model/authTokens.js';

const bkashauth = async (req, res) => {
    try {
        const { data } = await axios.post(process.env.bkash_grant_token_url, {
            app_key: process.env.bkash_app_key,
            app_secret: process.env.bkash_secret_key,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                username: process.env.bkash_username,
                password: process.env.bkash_password,
            }
        });

        const bkashToken = data.id_token;
        const bkashRefreshToken = data.refresh_token;

        if (bkashToken && bkashRefreshToken) {
            await authTokens.findByIdAndUpdate("62fa8c209b0571bec54a01e3", {
                $set: {
                    bkashToken: bkashToken,
                    bkashRefreshToken: bkashRefreshToken,
                },
            });
        }
        console.log('[*] Bkash Authentication Successful');
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
}

export default bkashauth