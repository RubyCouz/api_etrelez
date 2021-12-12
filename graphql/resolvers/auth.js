const createTokens = require('./createTokens')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const createCookies = require('./createCookies')
const {emailRegex, passwordRegex, loginRegex} = require('../../helpers/regex')
const nodemailer = require('nodemailer')
const config = require('../../config.json')

module.exports = {

    selectUser: async ({user_email}) => {
        const existingUser = await User.findOne(
            {user_email: user_email}
        )
        if (existingUser) {
            throw new Error('Utilisateur déjà inscrit')
        }
    },
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
                user_isActive: true,
                user_isDark: false,
            })
            const result = await user.save()
            // envoie de mail pour confirmation
            const output = `
                <h1>Bienvenue sur Eterelz, ${args.userInput.user_login}</h1>
                <p>Pour confirmer votre inscription ,veuillez cliquer sur le lien ci-dessous :</p>
                    <a href="http://localhost:3000/verifyAccount" title="Validation de l'inscription">Validation</a>
            `

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: config.email, // generated ethereal user
                    pass: config.pass, // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Eterelz" <admin@rubycouz.xyz>', // sender address
                to: args.userInput.user_email, // list of receivers
                subject: "Confirmation d'inscription à la communauté Eterelz", // Subject line
                text: "Hello world?", // plain text body
                html: output, // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

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