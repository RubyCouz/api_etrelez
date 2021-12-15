const jwt = require('jsonwebtoken')
const {REFRESH_TOKEN_KEY, TOKEN_KEY} = require('../../helpers/tokenKey')
const {TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME} = require('../../helpers/tokenExpireTime')

/**
 * Création des JWT pour le refresh token et token
 * @param {Object} user L'utilisateur
 * @returns {Object} Retourne le token et le refresh token
*/
module.exports = (user) => {
    // définition du token
    const token = jwt.sign(
        {
            userId: user.id,
            userRole: user.user_role,
            //user_email: user.user_email,
            user_isDark: user.user_isDark,
            exp: Math.floor(Date.now() / 1000) + ( TOKEN_EXPIRE_TIME * 60 ),
        },
        TOKEN_KEY
    )
    // définition du refresh token
    const refreshToken = jwt.sign(
        { 
            userId: user.id,
            exp: Math.floor(Date.now() / 1000) + ( REFRESH_TOKEN_EXPIRE_TIME * 60 ),
        },
        REFRESH_TOKEN_KEY
    )
    return {
        token,
        refreshToken
    }
}