const UserClan = require ('../../models/userClan')
const Clan = require('../../models/clan')
const {transformUserClan, transformClan} = require('./merge')

module.exports = {
    /**
     * liste des events auxquels participe un membre
     * @param args
     * @param req
     * @returns {Promise<*>}
     */
    userClan: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const userClans = await UserClan.find({user: req.userId})
            return userClans.map(userClan => {
                return transformUserClan(userClan)
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
    joinClan: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth) {
            throw new Error('Unauthenticated !!!')
        }
        const fetchedClan = await Clan.findOne({_id: args.clanId})
        const joining = new UserClan({
            user: req.userId,
            clan: fetchedClan
        })
        const result = await joining.save()
        return transformUserClan(joining)

    },
    /**
     * annulation affiliation à un clan
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    cancelJoinClan: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const userClan = await UserClan.findById(args.userClanId).populate('clan')
            const clan = transformClan(userClan.clan)
            await UserClan.deleteOne({
                _id: args.userClanId
            })
            return clan
        } catch (e) {
            throw e
        }
    }
}
