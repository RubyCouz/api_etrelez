const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    // faux jusqu'à preuve du contraire
    req.isAuth = false

    // récupération du champs 'Authorization'
    const cookie = (
        (req.cookies.jwt_HP && req.cookies.jwt_S) ?
            (req.cookies.jwt_HP + req.cookies.jwt_S) :
            false )

    // vérification on a récupéré quelque chose
    if (!cookie) return next()
   
    let decodedToken    
    // vérificiation de la validité du token
    try {
        decodedToken = jwt.verify(cookie, 'EterelzUser')
    } catch (err) {
        return next()
    }

    // si le token n'est pas valide
    if(!decodedToken) return next()

    // définition de la requête à true
    req.isAuth = true
    // récupération de l'id user stocké dans le token
    req.userId = decodedToken.userId
    next()
}