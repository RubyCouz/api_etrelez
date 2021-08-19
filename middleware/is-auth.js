const {TOKEN_KEY, REFRESH_TOKEN_KEY} = require('../helpers/tokenKey')
const createTokens = require('../graphql/resolvers/createTokens')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
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
                const decodedToken = jwt.verify(cookie, `TOKEN_KEY`)
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
                decodedRefreshToken = jwt.verify(refreshCookie, `REFRESH_TOKEN_KEY`)
            } catch (err) {
                return next()
            }
            const user = await User.findOne({_id: req.userId})
            if (!user) {
                return next()
            }
            const tokens = createTokens(user)
            // définition des options des cookies
            const expiresSecond = 7 * (24 * (60 * 60))
            const cookieOptions = {
                //domain: 'localhost:8080',
                //path: '/',
                expires: new Date(Date.now() + expiresSecond * 1000),
                sameSite: "Lax",
                //secure: true,
            }
            const arrayToken = tokens.token.split('.')
            const arrayRefreshToken = tokens.refreshToken.split('.')
            req.res
                .cookie('jwt_HP', arrayToken[0] + '.' + arrayToken[1],
                    {
                        ...cookieOptions,
                    }
                )
                .cookie('jwt_S', '.' + arrayToken[2],
                    {
                        ...cookieOptions,
                        httpOnly: true,
                    }
                )
            // stockage du refresh token dans cookie
            req.res
                .cookie('jwt_HP_RT', arrayRefreshToken[0] + '.' + arrayRefreshToken[1],
                    {
                        ...cookieOptions,
                    }
                )
                .cookie('jwt_S_RT', '.' + arrayRefreshToken[2],
                    {
                        ...cookieOptions,
                        httpOnly: true,
                    }
                )
            
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