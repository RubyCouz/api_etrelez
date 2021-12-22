const {errorName} = require('../errors/errorConstant')
const regex = require('../helpers/regex')
/**
 * validation des données entrant dans l'api
 * @param data
 */
exports.validForm = (data) => {
    // parcours de l'objet passé en paramêtre
    for (let key in data) {
        // suppression des espaces superflus
        data[key].trim()
        // passage des données dans les regexq
        if(!regex[key].test(data[key])) {
            // envoie d'une erreur
            throw new Error(errorName[key])
        }
    }
}