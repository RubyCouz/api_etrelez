
const config = require('../config.json')
const nodemailer = require("nodemailer");
exports.nodemailer = () => {
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
    return transporter
}