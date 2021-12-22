const User = require('../../models/user')
const Clan = require('../../models/clan')
const Game = require('../../models/game')

const {transformClan} = require('./merge')
const {errorName} = require("../../errors/errorConstant");

module.exports = {
    /**
     * liste de clans
     * @returns {Promise<*>}
     */
    clans: async () => {
        try {
            const clans = await Clan.find()
            return clans.map(clan => {
                return transformClan(clan)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * creation de clan
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    createClan: async (args, req) => {
        if (!req.isAuth.valid) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        const clan = new Clan({
            clan_name: args.clanInput.clan_name,
            clan_desc: args.clanInput.clan_desc,
            clan_banner: args.clanInput.clan_banner,
            clan_discord: args.clanInput.clan_discord,
            clan_population: args.clanInput.clan_population,
            clan_recrut: args.clanInput.clan_recrut,
            clan_activity: args.clanInput.clan_activity,
            clan_creator: req.isAuth.userId
        })
        let user_createdClan

        try {
            const result = await clan.save()
            user_createdClan = transformClan(result)
            const clan_creator = await User.findById(req.isAuth.userId)
            if (!clan_creator) {
                throw new Error('Utilisateur introuvable !!!')
            }
            console.log(clan_creator.user_createdClans)
            clan_creator.user_createdClans.push(clan)
            await clan_creator.save()
            return user_createdClan
        } catch (err) {
            throw err
        }
    }
}

