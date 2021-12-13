const nodemailer = require('nodemailer')
const config = require('../config.json')

module.exports = {
    sendVerificationMail: async (login, email, token) => {
        console.log(token)
        const output = `
                <h1>Bienvenue sur Eterelz, ${login}</h1>
                <p>Pour confirmer votre inscription ,veuillez cliquer sur le lien ci-dessous :</p>
                    <a href="http://localhost:3000/verifyAccount/${token}" title="Validation de l'inscription">Validation</a>
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
            to: email, // list of receivers
            subject: "Confirmation d'inscription à la communauté Eterelz", // Subject line
            text: "Hello world?", // plain text body
            html: output, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

}