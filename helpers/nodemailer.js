const {EMAIL, PASSWORD} = require('../config.js')
const nodemailer = require("nodemailer");
exports.nodemailer = () => {
    let transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: EMAIL, // generated ethereal user
            pass: PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    return transporter
}