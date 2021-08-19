const UserGame = require ('../../models/userGame')
const Game = require('../../models/game')
const {transformUserGame, transformGame} = require('./merge')

module.exports = {
    /**
     * liste des jeux auxquels joue un membre
     * @param args
     * @param req
     * @returns {Promise<*>}
     */
    userGame: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const userGames = await UserGame.find({user: req.userId})
            return userGames.map(userGame => {
                return transformUserGame(userGame)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * rejoindre un clan
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    playGame: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        const fetchedGame = await Game.findOne({_id: args.gameId})
        const joining = new UserGame({
            user: req.userId,
            game: fetchedGame
        })
        const result = await joining.save()
        return transformUserGame(joining)

    },
    /**
     * annulation affiliation à un clan
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    cancelPlayGame: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const userGame = await UserGame.findById(args.userGameId).populate('game')
            const clan = transformUserGame(userGame.clan)
            await UserGame.deleteOne({
                _id: args.userGameId
            })
            return clan
        } catch (e) {
            throw e
        }
    }
}
