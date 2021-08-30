const {TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME} = require('../../helpers/tokenExpireTime')

/**
 * Création des cookies pour les JWT
 * @param {Object} req
 * @param {Object} tokens Les tokens
*/
module.exports = (req, tokens) => {
    // stockage du token en tableau
    const arrayToken = tokens.token.split('.')
    // définition des options des cookies
    const cookieOptions = {
        //domain: 'localhost:8080',
        //path: '/',
        expires: new Date(Date.now() + TOKEN_EXPIRE_TIME * 60 * 1000),
        sameSite: "Lax",
        //secure: true,
    }

    // stockage du token dans cookie
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

    // stockage du refresh token en tableau
    const arrayRefreshToken = tokens.refreshToken.split('.')
    // définition des options des cookies refresh token
    const cookieOptionsRefreshToken = {
        //domain: 'localhost:8080',
        //path: '/',
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_TIME * 60 * 1000),
        sameSite: "Lax",
        //secure: true,
    }
    // stockage du refresh token dans cookie
    req.res
        .cookie('jwt_HP_RT', arrayRefreshToken[0] + '.' + arrayRefreshToken[1],
            {
                ...cookieOptionsRefreshToken,
            }
        )
        .cookie('jwt_S_RT', '.' + arrayRefreshToken[2],
            {
                ...cookieOptionsRefreshToken,
                httpOnly: true,
            }
        )

}