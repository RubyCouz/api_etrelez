exports.errorForm = {
    ERROR_MAIL: 'ERROR_MAIL',
    ERROR_EMPTY_MAIL: 'ERROR_EMPTY_MAIL',
    ERROR_PASSWORD: 'ERROR_PASSWORD',
    ERROR_EMPTY_PASSWORD: 'ERROR_EMPTY_PASSWORD',
    ERROR_NOT_EQUAL: 'ERROR_NOT_EQUAL',
    ERROR_LOGIN: 'ERROR_LOGIN',
    ERROR_EMPTY_LOGIN: 'ERROR_EMPTY_LOGIN',
}

exports.errorType = {
    ERROR_MAIL: {
        message: 'Veuillez saisir une adresse Email valide',
        statusCode: 700
    },
    ERROR_EMPTY_MAIL: {
        message: 'Veuillez remplir ce champ',
        statusCode: 701
    },
    ERROR_PASSWORD: {
        message: 'Veuillez un mot de passe valide',
        statusCode: 702
    },
    ERROR_EMPTY_PASSWORD: {
        message: 'Veuillez remplir ce champ',
        statusCode: 703
    },
    ERROR_NOT_EQUAL: {
        message: 'Les mots de passe ne correspondent pas',
        statusCode: 703
    },
    ERROR_LOGIN: {
        message: 'Veuillez saisir un pseudo conforme',
        statusCode: 703
    },
    ERROR_EMPTY_LOGIN: {
        message: 'Veuillez remplir ce champ',
        statusCode: 703
    },
}