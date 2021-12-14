const createTokens = require('./createTokens')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const createCookies = require('./createCookies')
const {emailRegex, passwordRegex, loginRegex} = require('../../helpers/regex')
const verificationMail = require('../../middleware/sendVerificationMail')
const jwt = require("jsonwebtoken");
// const {CONFIRMATION_TOKEN_EXPIRE_TIME} = require('../../helpers/tokenExpireTime')
const {TOKEN_KEY} = require("../../helpers/tokenKey")
const {errorName} = require('../../errors/errorsConstant')
const {confirmationToken} = require('../../middleware/confirmationToken')
// const {transformUser} = require('./merge')
// const {log} = require("nodemon/lib/utils");
// const {decode} = require("jsonwebtoken");

module.exports = {

    /**
     * sélection d'un utilisateur en fonction de son mail
     * @param user_email
     * @returns {Promise<*>}
     */
    // selectUser: async ({user_email}) => {
    //     const existingUser = await User.findOne(
    //         {user_email: user_email}
    //     )
    //     if (existingUser) {
    //         throw new Error('Utilisateur déjà inscrit')
    //     }
    //     return existingUser
    // },

    /**
     * inscription (création utilisateur)
     * @param args
     * @returns {Promise<{[p: string]: *}>}
     */
    createUser: async (args) => {

        try {
            if (!emailRegex.test(args.userInput.user_email)) {
                throw new Error('Email non valide !')
            }
            if (!passwordRegex.test(args.userInput.user_password)) {
                throw new Error('Mot de passe non valide !')
            }
            if (!loginRegex.test(args.userInput.user_login)) {
                throw new Error('Login non valide !')
            }
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
                user_isActive: false,
                user_isDark: false,
            })
            const result = await user.save()
            // création du token de vérification
            const token = confirmationToken(result)
            // envoie de mail pour confirmation
            await verificationMail.sendVerificationMail(
                result.user_login,
                result.user_email,
                token
            )
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
     * confirmation d'inscription
     * @param args
     * @returns {Promise<void>}
     */
    confirmUser: async (args) => {
        let user
        const decodedToken = await jwt.verify(args.token, TOKEN_KEY, async (err, decoded) => {
            if (args.token === null || args.token === '') {
                throw new Error(errorName.TOKEN_NULL)
            }
            if (err.name === 'TokenExpiredError') {
                throw new Error(errorName.EXPIRED_TOKEN)
            }
            if (err.name === 'JsonWebTokenError') {
                throw new Error(errorName.WRONG_TOKEN)
            }
            if (err.name === 'NotBeforeError') {
                throw new Error(errorName.NOT_BEFORE)
            }
            if (decoded) {
                user = User.findByIdAndUpdate(
                    decoded.id,
                    {user_isActive: true}
                )
                if (user.user_email !== decoded.user_email) {
                    throw new Error(errorName.WRONG_MAIL)
                }
                if (!user) {
                    throw new Error(errorName.WRONG_USER)
                }
                return user
            }
        })
    },

    /**
     * renvoie de la confirmation d'inscription
     * @returns {Promise<void>}
     * @param args
     */
    reVerify: async (args) => {
        console.log(args)
        const user = await User.findOne(
            {user_email: args.user_email}
        )
        console.log(user)
        const token = await confirmationToken(user)
        console.log(token)
        try {
            await verificationMail.sendVerificationMail(
                user.user_login,
                user.user_email,
                token
            )
        } catch (e) {
            throw new Error(e)
        }
        return user
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
        // check email
        if (!emailRegex.test(user_email)) {
            throw new Error('Email non valide !')
        }
        const user = await User.findOne({user_email: user_email})
        if (!user) {
            throw new Error('Cet utilisateur n\'existe pas')
        }
        // check password
        if (!passwordRegex.test(user_password)) {
            throw new Error('Mot de passe non valide !')
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

        createCookies(req, tokens)

        return {
            token: tokens.token,
            refreshToken: tokens.refreshToken,
        }
    },
}