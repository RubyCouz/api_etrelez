const createTokens = require('../graphql/resolvers/createTokens')
const createCookies = require('../graphql/resolvers/createCookies')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {REFRESH_TOKEN_KEY, TOKEN_KEY} = require('../helpers/tokenKey')

module.exports = async (req, res, next) => {
    // faux jusqu'à preuve du contraire
    req.isAuth = {
        valid: false,
        userRole: null,
        userId: null
    }

    // récupération du champs 'Authorization'
    const cookie = (
        (req.cookies.jwt_HP && req.cookies.jwt_S) ?
            (req.cookies.jwt_HP + req.cookies.jwt_S) :
            false)
    const refreshCookie = (
        (req.cookies.jwt_HP_RT && req.cookies.jwt_S_RT) ?
            (req.cookies.jwt_HP_RT + req.cookies.jwt_S_RT) :
            false)

    // vérification on a récupéré quelque chose
    if (cookie || refreshCookie) {
        let role, id

        if (cookie) {
            // vérificiation de la validité du token
            try {
                const decodedToken = jwt.verify(cookie, TOKEN_KEY)
                // récupération de l'id user stocké dans le token
                id = decodedToken.userId
                role = decodedToken.userRole

            } catch (err) {
                return next()
            }
        } else if (refreshCookie) {
            let decodedRefreshToken
            // vérificiation de la validité du refresh token
            try {
                decodedRefreshToken = jwt.verify(refreshCookie, REFRESH_TOKEN_KEY)
            } catch (err) {
                return next()
            }

            const user = await User.findOne({_id: decodedRefreshToken.userId})
            if (!user) {
                return next()
            }

            const tokens = createTokens(user)
            createCookies(req, tokens)
            
            id = user.id
            role = user.user_role
        }

        req.isAuth = {
            valid: true,
            userRole: role,
            userId: id
        }
    }

    next()
}