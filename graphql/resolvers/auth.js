const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')

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
                user_password: hashedPassword
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
     * @returns {Promise<{tokenExpiration: number, userId, token: (*)}>}
     */
    login: async ({user_email, user_password}) => {
        const user = await User.findOne({user_email: user_email})
        if(!user) {
            throw new Error('Cet Utilisateur n\'existe pas')
        }
        const isEqual = await bcrypt.compare(user_password, user.user_password)
        if(!isEqual) {
            throw new Error('Le mot de passe est incorrect !!!')
        }

        const token = jwt.sign(
            {userId: user.id, user_email: user.user_email},
            'EterelzUser',
            {
                expiresIn: '2h'
            }
        )
        return {
            userId:user.id,
            token: token,
            tokenExpiration: 2
        }
    }

}