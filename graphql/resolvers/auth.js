
const createTokens = require('./createTokens')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
module.exports = {
    /**
     * inscription (création utilisateur)
     * @param args
     * @returns {Promise<{[p: string]: *}>}
     */
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({
                user_email: args.userInput.user_email
            })
            if (existingUser) {
                throw new Error('Utilisateur déjà existant dans la base !!!')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.user_password, 12)

            const user = new User({
                user_login: args.userInput.user_login,
                user_email: args.userInput.user_email,
                user_password: hashedPassword,
                user_role: 'membre',
                user_isActive: true,
                user_isDark: false,
            })
            const result = await user.save()
            return {
                ...result._doc,
                user_password: null,
                _id: result.id
            }
        } catch (err) {
            throw err
        }
    },
    /**
     * connexion
     * @param user_email
     * @param user_password
     * @param stay_logged
     * @param req
     * @returns {Promise<{token: (*)}>}
     */
    login: async ({user_email, user_password}, req) => {
        req.isAuth = false
        const user = await User.findOne({user_email: user_email})
        if (!user) {
            throw new Error('Cet Utilisateur n\'existe pas')
        }
        const isEqual = await bcrypt.compare(user_password, user.user_password)
        if (!isEqual) {
            throw new Error('Le mot de passe est incorrect !!!')
        }
        // création du token et du refresh token
        const tokens = createTokens(user)
        if (tokens) {
             req.isAuth = true
        }
        const expiresSecond = (60 * 60)
        // stockage du token en tableau
        const arrayToken = tokens.token.split('.')
        // définition des options des cookies
        const cookieOptions = {
            //domain: 'localhost:8080',
            //path: '/',
            expires: new Date(Date.now() + expiresSecond * 1000),
            sameSite: "Lax",
            //secure: true,
        }
        // stockage du refresh token en tableau
        const arrayRefreshToken = tokens.refreshToken.split('.')
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

        return {
            token: tokens.token,
            refreshToken : tokens.refreshToken,
        }
    },
}