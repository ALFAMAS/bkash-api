import mongoose from 'mongoose';

const AuthToken = new mongoose.Schema(
    {
        bkashToken: {
            type: String
        },
        bkashRefreshToken: {
            type: String
        }
    },
    {
        versionKey: false
    }
);

export default mongoose.model('AuthToken', AuthToken);