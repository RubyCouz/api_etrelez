const jwt = require("jsonwebtoken");
const {CONFIRMATION_TOKEN_EXPIRE_TIME} = require("../helpers/tokenExpireTime");
const {TOKEN_KEY} = require("../helpers/tokenKey");
exports.confirmationToken = (info, pass) => {
    return jwt.sign(
        {
            id: info._id,
            user_email: info.user_email,
            pass,
            exp: Math.floor(Date.now() / 1000) + (CONFIRMATION_TOKEN_EXPIRE_TIME * 60)
        },
        TOKEN_KEY
    )

}