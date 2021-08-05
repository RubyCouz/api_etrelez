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
                user_password: hashedPassword,
                user_role: 'membre',
                user_isActive: true,
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
     * @param req
     * @returns {Promise<{token: (*)}>}
     */
    login: async ({user_email, user_password}, req) => {
        const user = await User.findOne({user_email: user_email})
        if(!user) {
            throw new Error('Cet Utilisateur n\'existe pas')
        }
        const isEqual = await bcrypt.compare(user_password, user.user_password)
        if(!isEqual) {
            throw new Error('Le mot de passe est incorrect !!!')
        }

        const expiresSecond = 1 * (60 * 60); 

        const token = jwt.sign(
            {
                userId: user.id,
                userRole: user.user_role,
                user_email: user.user_email,
                user_isDark: user.user_isDark,
                exp: Math.floor(Date.now() / 1000) + expiresSecond ,
            },
            'EterelzUser'
        )
        console.log(token)
        const arrayToken = token.split('.')

        const cookieOptions = {
            //domain: 'localhost:8080',
            //path: '/',
            expires:  new Date(Date.now() + expiresSecond * 1000),
            sameSite: "Lax",
            //secure: true,
        }

        req.res
            .cookie('jwt_HP', arrayToken[0] + '.' + arrayToken[1] , 
                {
                    ...cookieOptions,
                }
            )
            .cookie('jwt_S', '.' + arrayToken[2] , 
                { 
                    ...cookieOptions,
                    httpOnly: true,
                }
            )
        return {
            token: token,
        }
    }

}