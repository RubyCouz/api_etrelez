/**
 * user
 * @type {RegExp}
 */
exports.user_email = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,4}$')
exports.user_password = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')
exports.user_login = new RegExp('^[^@&\"()<>!_$*€£`+=\\/;?#]+$')
exports.user_discord = new RegExp('^(([\\wàâäéèëêùûüìîïòôöçãñõ\\-\\_\\[\\]\\(\\)\\{\\}\\s\\/\\\\`\\\'\\!\\?\\|]+?)#\\d{4}$)')
exports.user_address = new RegExp('^[\\wàâäéèëêùûüìîïòôöçãñõ\\-\\s]+$')
exports.user_zip = new RegExp('^[\\d]{5}$')
exports.user_city = new RegExp('^[\\wàâäéèëêùûüìîïòôöçãñõ\\-\\s]+$')
exports.user_role = new RegExp('^admin|membre$')
exports.user_state = new RegExp('^[a-zA-Zàâäéèëêùûüìîïòôöçãñõ\\s\\-]+$')
/**
 * event
 */
exports.event_name = new RegExp('^[^<>]+$')
exports.event_desc = new RegExp('^[^<>]+$')
exports.event_date = new RegExp('^[^<>]+$')
exports.event_score = new RegExp('^[^<>]+$')
exports.event_winner = new RegExp('^[^<>]+$')
/**
 * token
 * @type {RegExp}
 */
exports.tokenRegex = new RegExp('^[\w]{6}$')
/**
 * game
 * @type {RegExp}
 */
exports.game_name = new RegExp('^[^<>]+$')
exports.game_pic = new RegExp('^[^<>]+$')
exports.game_desc = new RegExp('^[^<>]+$')

/**
 * clan
 * @type {RegExp}
 */
exports.clan_name = new RegExp('^[^<>]+$')
exports.clan_desc = new RegExp('^[^<>]+$')
exports.clan_banner = new RegExp('^[^<>]+$')
exports.clan_discord = new RegExp('^[^<>]+$')
exports.clan_population = new RegExp('^[^<>]+$')
exports.clan_activity = new RegExp('^[^<>]+$')
exports.clan_recrut = new RegExp('^[^<>]+$')

