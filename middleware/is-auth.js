const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    // récupération du champs 'Authorization'
    const authHeader = req.get('Authorization')
    if(!authHeader) {
        // défintion de la requête à false
        req.isAuth = false
        // envoie à la méthode suivante
        return next()
    }
    const token = authHeader.split(' ')[1]
    // si le token n'existe pas ou est vide
    if(!token || token === ' ') {
        req.isAuth = false
        return next()
    }
    let decodedToken
    // vérficiation de la validité du token
    try {
        decodedToken = jwt.verify(token, 'EterelzUser')
    } catch (err) {
        req.isAuth = false
        return next()
    }
    // si le token n'est pas valide
    if(!decodedToken) {
        req.isAuth = false
        return next()
    }
    // définition de la requête à true
    req.isAuth = true
    // récupération de l'id user stocké dans le token
    req.userId = decodedToken.userId
    next()
}