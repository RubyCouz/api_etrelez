const createTokens = require('./createTokens')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const createCookies = require('./createCookies')
const {emailRegex, passwordRegex, loginRegex} = require('../../helpers/regex')


module.exports = {

    selectUser: async ({user_email}) => {
        const existingUser = await User.findOne(
        {user_email: user_email}
        )
        if(existingUser) {
            throw new Error ('Utilisateur déjà inscrit')
        }
    },
    /**
     * inscription (création utilisateur)
     * @param args
     * @returns {Promise<{[p: string]: *}>}
     */
    createUser: async (args) => {

        try {
            if(!emailRegex.test(args.userInput.user_email)) {
                throw new Error('Email non valide !')
            }
            if(!passwordRegex.test(args.userInput.user_password)) {
                throw new Error('Mot de passe non valide !')
            }
            if(!loginRegex.test(args.userInput.user_login)) {
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
        // check email
        if(!emailRegex.test(user_email)){
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
            refreshToken : tokens.refreshToken,
        }
    },
}