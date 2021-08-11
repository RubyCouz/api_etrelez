const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const {REFRESH_TOKEN_KEY, TOKEN_KEY} = require('../../helpers/tokenKey')

module.exports = (args) => {
        // définition token
console.log(args)
    const expiresSecond = (60 * 60)
    const token = jwt.sign(
            {
                userId: args.id,
                userRole: args.user_role,
                user_email: args.user_email,
                user_isDark: args.user_isDark,
                exp: Math.floor(Date.now() / 1000) + expiresSecond,
            },
            `TOKEN_KEY`
        )
        // définition du refresh token
        const refreshToken = jwt.sign(
            {
                userId: args.id,
                userRole: args.user_role,
                user_email: args.user_email,
                user_isDark: args.user_isDark,
                exp: Math.floor(Date.now() / 1000) + expiresSecond,
            },
            `REFRESH_TOKEN_KEY`
        )
        return {
            token,
            refreshToken
        }
}