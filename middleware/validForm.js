const {errorName} = require('../errors/errorConstant')
const regex = require('../helpers/regex')
/**
 * validation des données entrant dans l'api
 * @param data
 */
exports.validForm = (data) => {
    // parcours de l'objet passé en paramêtre
    for (let key in data) {

        if (typeof data[key] !== 'boolean') {
            // suppression des espaces superflus
            data[key].trim()
            if (data[key] !== '') {
                // passage des données dans les regexs
                if (!regex[key].test(data[key])) {
                    // envoie d'une erreur
                    throw new Error(errorName[key])
                }
            }
        }
    }
}