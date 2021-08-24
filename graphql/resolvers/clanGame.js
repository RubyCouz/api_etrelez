const ClanGame = require ('../../models/clanGame')
const Game = require('../../models/game')
const {transformClanGame, transformGame} = require('./merge')

module.exports = {
    /**
     * liste des jeux auxquels jouent un clan
     * @param args
     * @param req
     * @returns {Promise<*>}
     */
    clanGame: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const clanGames = await ClanGame.find({clan: req.isAuth.clanId})
            return clanGames.map(clanGame => {
                return transformClanGame(clanGame)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * joindre un jeux à un clan
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    joinGame: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        const fetchedGame = await Game.findOne({_id: args.gameId})
        const joining = new Game({
            clan: req.isAuth.clanId,
            game: fetchedGame
        })
        const result = await joining.save()
        return transformClanGame(joining)

    },
    /**
     * annulation affiliation clan / jeux
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    cancelClanGame: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const clanGame = await ClanGame.findById(args.clanGameId).populate('game')
            const game = transformGame(clanGame.game)
            await ClanGame.deleteOne({
                _id: args.clanGameId
            })
            return game
        } catch (e) {
            throw e
        }
    }
}
