// expiration du token
exports.errorName = {
    /**
     * erreur de permission
     */
    PERMISSION_ERROR: 'PERMISSION_ERROR',
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
     * user
     */
    user_email: 'user_email',
    ERROR_EMPTY_MAIL: 'ERROR_EMPTY_MAIL',
    user_password: 'user_password',
    ERROR_EMPTY_PASSWORD: 'ERROR_EMPTY_PASSWORD',
    ERROR_NOT_EQUAL: 'ERROR_NOT_EQUAL',
    user_login: 'user_login',
    ERROR_EMPTY_LOGIN: 'ERROR_EMPTY_LOGIN',
    user_discord: 'user_discord',
    user_address: 'user_address',
    user_zip: 'user_zip',
    user_role: 'user_role',
    user_state: 'user_state',
    /**
     * DB
     */
    ERROR_USER: 'ERROR_USER',
    /**
     * connection
     */
    ISACTIVE: 'ISACTIVE',
    /**
     * jeux
     */
    GAME_NOT_EXIST: 'GAME_NOT_EXIST',
    game_name: 'game_name',
    game_desc: 'game_desc',
    game_pic: 'game_pic',
    /**
     * event
     */
    event_name: 'event_name',
    event_desc: 'event_desc'
}
exports.errorType = {
    /**
     * erreur de permission
     */
    PERMISSION_ERROR: {
        message: 'Vous n\'avez pas la permission d\'effectuer cette action',
        statusCode: '100'
    },
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
     * user
     */
    user_email: {
        message: 'Veuillez saisir une adresse Email valide',
        statusCode: 700
    },
    ERROR_EMPTY_MAIL: {
        message: 'Veuillez remplir ce champ',
        statusCode: 701
    },
    user_password: {
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
    user_login: {
        message: 'Veuillez saisir un pseudo conforme',
        statusCode: 703
    },
    user_discord: {
        message: 'L\'identifiant discord est incorrect',
        statusCode: 703
    },
    user_address: {
        message: 'l\'adresse n\'est pas valide',
        statusCode: 703
    },
    user_zip: {
        message: '^Code postal non valide',
        statusCode: 703
    },
    user_city: {
        message: 'Cette ville n\'existe pas... Pas cet univers en tout cas',
        statusCode: 703
    },
    user_role: {
        message: 'N\'essayez pas de créer des rôles sans la permission d\'un administrateur, svp',
        statusCode: 703
    },
    user_state: {
        message: 'Je ne sais pas quoi dire... A part que cet état n\existe pas par ici',
        statusCode: 703
    },
    /**
     * Db
     */
    ERROR_USER: {
        message: 'Cet utilisateur n\'existe pas dans le base de données',
        statusCode: 800
    },
    ERROR_PASSWORD_DB: {
        message: 'Mot de passe erroné',
        statusCode: 800
    },
    /**
     * connection
     */
    ISACTIVE: {
        message: 'Vous devez valider votre compte avant de vous connecter. Vérifier la réception d\'un email de confirmation dans votre messagerie'
    },
    /**
     * jeux
     */
    GAME_NOT_EXIST: {
        message: 'Ce jeux n\'est pas encore enregistré'
    },
    game_name: {
        message: 'Certains caractères ne sont pas pris en compte de le titre du jeu'
    },
    game_desc: {
        message: 'Il y a des caractères invalides dans votre description'
    },
    game_pic: {
        message: 'Cette image n\'est pas prise en charge'
    },
    /**
     * event
     */
    event_desc: {
        message: 'Une erreur s\'est glissée dans cette description'
    },
    event_name: {
        message: 'Le nom pour cet event est incorrect'
    }
}


