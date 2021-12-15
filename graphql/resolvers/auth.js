const createTokens = require('./createTokens')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const createCookies = require('./createCookies')
const {emailRegex, passwordRegex, loginRegex, tokenRegex} = require('../../helpers/regex')
const verificationMail = require('../../middleware/sendVerificationMail')
const jwt = require("jsonwebtoken");
const {TOKEN_KEY} = require("../../helpers/tokenKey")
const {errorToken} = require('../../errors/errorsToken')
const {errorForm} = require('../../errors/errorsForm')
const {errorDb} = require('../../errors/ErrorsDb')
const {confirmationToken} = require('../../middleware/confirmationToken')
const {passConfirmation} = require('../../helpers/passConfirmation')

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
                throw new Error(errorForm.ERROR_MAIL)
            }
            if (!passwordRegex.test(args.userInput.user_password)) {
                throw new Error(errorForm.ERROR_PASSWORD)
            }
            if (!loginRegex.test(args.userInput.user_login)) {
                throw new Error(errorForm.ERROR_LOGIN)
            }
            const existingUser = await User.findOne({
                user_email: args.userInput.user_email
            })
            if (existingUser) {
                throw new Error(errorDb.ERROR_USER)
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
            // création code secret
            const pass = passConfirmation()
            // création du token de vérification
            const token = confirmationToken(result, pass)
            // envoie de mail pour confirmation
            await verificationMail.sendVerificationMail(
                result.user_login,
                result.user_email,
                pass,
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
        console.log(args)
        let user
        const decodedToken = await jwt.verify(args.token, TOKEN_KEY, async (err, decoded) => {
            if (args.token === null || args.token === '') {
                throw new Error(errorToken.TOKEN_NULL)
            }
            if(err) {
                console.log(err)
                if (err.name === 'TokenExpiredError') {
                    throw new Error(errorToken.EXPIRED_TOKEN)
                }
                console.log(err.name)
                if (err.name === 'JsonWebTokenError') {
                    throw new Error(errorToken.WRONG_TOKEN)
                }
                console.log(err.name)
                if (err.name === 'NotBeforeError') {
                    throw new Error(errorToken.NOT_BEFORE)
                }
                console.log(err.name)
            }
            // if(!tokenRegex.test(args.pass)) {
            //     throw new Error(errorToken.WRONG_PASS)
            // }
            if (decoded) {
                if(decoded.pass !== args.pass) {
                    throw new Error(errorToken.WRONG_PASS)
                }
                user = await User.findById(decoded.id)
                if (!user) {
                    throw new Error(errorToken.WRONG_USER)
                }
                if (user.user_email !== decoded.user_email) {
                    throw new Error(errorToken.WRONG_MAIL)
                }
                user = User.findByIdAndUpdate(
                    decoded.id,
                    {user_isActive: true}
                )
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
        if(args.user_email === null || args.user_email === '') {
            throw new Error(errorForm.ERROR_EMPTY_MAIL)
        }
        if(!emailRegex.test(args.user_email)) {
            throw new Error(errorForm.ERROR_MAIL)
        }
        const user = await User.findOne(
            {user_email: args.user_email}
        )
        const token = await confirmationToken(user, args.pass)
        try {
            await verificationMail.sendVerificationMail(
                user.user_login,
                user.user_email,
                args.pass,
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
        if(user_email === null || user_email === '') {
            throw new Error(errorForm.ERROR_EMPTY_MAIL)
        }
        if (!emailRegex.test(user_email)) {
            throw new Error(errorForm.ERROR_MAIL)
        }
        const user = await User.findOne({user_email: user_email})
        if (!user) {
            throw new Error(errorDb.ERROR_USER)
        }
        // check password
        if (!passwordRegex.test(user_password)) {
            throw new Error(errorForm.ERROR_PASSWORD)
        }
        if(user_password === '' || user.user_password === null) {
            throw new Error(errorForm.ERROR_EMPTY_PASSWORD)
        }
        const isEqual = await bcrypt.compare(user_password, user.user_password)
        if (!isEqual) {
            throw new Error(errorForm.ERROR_NOT_EQUAL)
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