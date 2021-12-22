const Game = require('../../models/game')
const User = require('../../models/user')
const {transformGame} = require('./merge')
const {validForm} = require('../../middleware/validForm')
const {errorName} = require('../../errors/errorConstant')

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
            throw new Error(errorName.PERMISSION_ERROR)
        }
        // vérification des données saisie
        validForm(args.gameInput)
        // instanciation d'un nouvel objet game
        const game = new Game({
            game_name: args.gameInput.game_name,
            game_desc: args.gameInput.game_desc,
            game_pic: args.gameInput.game_pic,
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
                throw new Error(errorName.PERMISSION_ERROR)
            }
            // sauvegarde du user dans l'objet game qui vient d'être créé
            game_creator.user_addedGames.push(game)
            await game_creator.save()
            return createdGame
        } catch (err) {
            throw err
        }

    },
    /**
     * Modification des informations d'un jeu
     * @param _id
     * @param updateGameInput
     * @param req
     * @returns {Promise<*&{createdAt: string, _id: *, game_creator: *, updatedAt: string}>}
     */
    updateGame: async ({_id, GameInput}, req) => {
        if (!req.isAuth.valid && !(req.isAuth.userRole === "admin" || req.isAuth.userId === _id)) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        validForm(args.gameInput)
        try {
            const game = await Game.findById(_id)
            if (!game) {
                throw new Error(errorName.GAME_NOT_EXIST)
            } else {
                Game.findOneAndUpdate(
                    {_id: _id},
                    GameInput,
                    function (err, doc) {
                        if (err) return res.send(500, {error: err})
                    }
                )
            }
            return transformGame(game)
        } catch (e) {
            throw e
        }
    }
}
