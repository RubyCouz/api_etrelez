// expiration du token
exports.errorName = {
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    WRONG_MAIL: 'WRONG_MAIL',
    WRONG_TOKEN: 'WRONG_TOKEN',
    WRONG_USER: 'WRONG_USER',
    TOKEN_NULL: 'TOKEN_NULL',
    NOT_BEFORE: 'NOT_BEFORE',
}
exports.errorType = {
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
}


