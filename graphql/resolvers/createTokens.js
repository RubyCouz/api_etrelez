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
            is_active: user.user_isActive,
            is_online: user.user_isOnline,
            exp: Math.floor(Date.now() / 1000) + ( TOKEN_EXPIRE_TIME * 60 ),
        },
        TOKEN_KEY
    )
    // définition du refresh token
    const refreshToken = jwt.sign(
        {
            userId: user.id,
            userRole: user.user_role,
            is_active: user.user_isActive,
            exp: Math.floor(Date.now() / 1000) + ( REFRESH_TOKEN_EXPIRE_TIME * 60 ),
        },
        REFRESH_TOKEN_KEY
    )
    return {
        token,
        refreshToken
    }
}