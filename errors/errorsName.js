// expiration du token
exports.errorName = {
    /**
     * token
     */
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    WRONG_MAIL: 'WRONG_MAIL',
    WRONG_TOKEN: 'WRONG_TOKEN',
    WRONG_USER: 'WRONG_USER',
    TOKEN_NULL: 'TOKEN_NULL',
    NOT_BEFORE: 'NOT_BEFORE',
    WRONG_PASS: 'WRONG_PASS',
    /**
     * form
     */
    ERROR_MAIL: 'ERROR_MAIL',
    ERROR_EMPTY_MAIL: 'ERROR_EMPTY_MAIL',
    ERROR_PASSWORD: 'ERROR_PASSWORD',
    ERROR_EMPTY_PASSWORD: 'ERROR_EMPTY_PASSWORD',
    ERROR_NOT_EQUAL: 'ERROR_NOT_EQUAL',
    ERROR_LOGIN: 'ERROR_LOGIN',
    ERROR_EMPTY_LOGIN: 'ERROR_EMPTY_LOGIN',
    /**
     * DB
     */
    ERROR_USER: 'ERROR_USER'
}
exports.errorType = {
    /**
     * token
     */
    EXPIRED_TOKEN: {
        message: 'Ce token est expiré',
        statusCode: 600
    },
    WRONG_MAIL: {
        message: 'L\'email du compte ne correspond pas',
        statusCode: 601
    },
    WRONG_TOKEN: {
        message: 'Le token d\'activation ne correspond pas',
        statusCode: 602
    },
    WRONG_USER: {
        message: 'L\'utilisateur ne correspond pas',
        statusCode: 603
    },
    TOKEN_NULL: {
        message: 'Le lien d\'activation ne correspond pas',
        statusCode: 604
    },
    NOT_BEFORE: {
        message: 'Il est encore trop tôt pour activer votre compte',
        statusCode: 605
    },
    WRONG_PASS: {
        message: 'Votre Code est incorrect',
        statusCode: 606
    },
    /**
     * form
     */
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
    /**
     * Db
     */
    ERROR_USER: {
        message: 'Cet utilisateur n\'existe pas dans le base de données',
        statusCode: 800
    },
}


