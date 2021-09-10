const Game = require('../../models/game')
const User = require('../../models/user')
const {transformGame} = require('./merge')

module.exports = {
    /**
     * liste des jeux
     * @returns {Promise<*>}
     */
    games: async () => {
        try {
            const games = await Game.find()
            return games.map(game => {
                return transformGame(game)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * ajout d'un jeux
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    createGame: async (args, req) => {
        if (!req.isAuth.valid) {
            throw new Error('Vous devez être connecté pour effectuer cette action !!!')
        }
        // regex pour vérifier les données envoyées par l'appli
        const regexText = new RegExp('^[A-Za-z0-9\\s\.\_\,\;\:\!\?\/\#\&éèêëàâä\$ùûüîïôöñ\\n\@]+$')
        // définition d'un tableau contenant les données validées par la fonction de validation
        let validData = []
        const verifData = (regex, data) => {
            console.log(regexText)
            if (regex.test(data)) {
                data.trim()
                validData.push(data)
                return true
            } else {
                throw new Error('Le champs ' + data + ' contient des caractères invalides')
            }
        }
        // vérification des données saisie
        if (verifData(regexText, args.gameInput.game_name) && verifData(regexText, args.gameInput.game_desc) && verifData(regexText, args.gameInput.game_pic)) {
            // instanciation d'un nouvel objet game
            const game = new Game({
                game_name: validData[0],
                game_desc: validData[1],
                game_pic: validData[2],
                game_creator: req.isAuth.userId
            })
            let createdGame
            try {
                // envoie des données dans la base
                const result = await game.save()
                createdGame = transformGame(result)
                // recherche du user qui fait la création
                const game_creator = await User.findById(req.isAuth.userId)
                // si l'utilisateur n'existe pas
                if (!game_creator) {
                    throw new Error('Utilisateur inconnu !!!')
                }
                // sauvegarde du user dans l'objet game qui vient d'être créé
                game_creator.user_addedGames.push(game)
                await game_creator.save()
                return createdGame
            } catch (err) {
                throw err
            }
        }
    },
}
