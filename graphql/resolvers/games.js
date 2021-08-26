const Game = require ('../../models/game')
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
        if(!req.isAuth.valid) {
            throw new Error('Vous devez être connecté pour effectuer cette action !!!')
        }

        const game = new Game({
            game_name: args.gameInput.game_name,
            game_desc: args.gameInput.game_desc,
            game_pic: args.gameInput.game_pic,
            game_creator: req.isAuth.userId
        })
        let createdGame

        try {
            const result = await game.save()
            createdGame = transformGame(result)
            const game_creator = await User.findById(req.isAuth.userId)
            if(!game_creator) {
                throw new Error('Utilisateur inconnu !!!')
            }
            game_creator.user_addedGames.push(game)
            await game_creator.save()
            return createdGame
        } catch (err) {
            throw err
        }
    },
}
