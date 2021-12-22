exports.user_email = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,4}$')
exports.user_password = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')
exports.user_login = new RegExp('^[^@&\"()<>!_$*€£`+=\\/;?#]+$')
exports.user_discord = new RegExp('^(([\\wàâäéèëêùûüìîïòôöçãñõ\\-\\_\\[\\]\\(\\)\\{\\}\\s\\/\\\\`\\\'\\!\\?\\|]+?)#\\d{4}$)')
exports.user_address = new RegExp('^[\\wàâäéèëêùûüìîïòôöçãñõ\\-\\s]+$')
exports.user_zip = new RegExp('^[\\d]{5}$')
exports.user_city = new RegExp('^[\\wàâäéèëêùûüìîïòôöçãñõ\\-\\s]+$')
exports.user_role = new RegExp('^admin|membre$')
exports.user_state = new RegExp('^[a-zA-Zàâäéèëêùûüìîïòôöçãñõ\\s\\-]+$')



exports.tokenRegex = new RegExp('^[\w]{6}$')
exports.game_name = new RegExp('^[^<>]+$')
exports.game_pic = new RegExp('^[^<>]+$')
exports.game_desc = new RegExp('^[^<>]+$')
