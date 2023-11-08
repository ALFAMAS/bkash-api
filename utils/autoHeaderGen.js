import authTokens from "../model/authTokens.js"

export const autoHeaderGen = async () => {
    const bkashToken = await authTokens.findById("62fa8c209b0571bec54a01e3");
    console.log(bkashToken);
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: bkashToken.bkashToken,
        'x-app-key': process.env.bkash_app_key,
    }
}