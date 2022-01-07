const User = require('../../models/user')
const Clan = require('../../models/clan')
// const Game = require('../../models/game')

const {transformClan} = require('./merge')
const {errorName} = require("../../errors/errorConstant");
const {validForm} = require("../../middleware/validForm");

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

        validForm(args.clanInput)

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
            let picName
            if (args.clanInput.clan_banner !== undefined) {
                const file = args.clanInput.clan_banner.split('.')
                const ext = file.pop()
                picName = result._id + '_clan.' + ext
            }

            const updateClanInput = {clan_banner: picName}
            // enregistrement du fichier après renommage
            Clan.findOneAndUpdate({
                    _id: clan._id,
                },
                updateClanInput,
                function (err, doc) {
                    console.log(err)
                    if (err) return res.send(500, {error: err});
                }
            )
            user_createdClan = transformClan(result)
            const clan_creator = await User.findById(req.isAuth.userId)
            if (!clan_creator) {
                throw new Error(errorName.PERMISSION_ERROR)
            }
            clan_creator.user_createdClans.push(clan)
            await clan_creator.save()
            return user_createdClan
        } catch (err) {
            throw err
        }
    },
    /**
     * suppression d'un clan
     * @param args
     * @param req
     * @returns {Promise<*&{createdAt: string, clan_members: *, clan_game: *, _id: *, clan_creator: *, updatedAt: string}>}
     */
    deleteClan: async (args, req) => {
        if (!req.isAuth.valid) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        const clan = await Clan.findById({_id: args.id})
        try {
            clan.remove()
            return transformClan(clan)
        } catch (e) {
            console.log(e)
            throw e
        }
    },
    /**
     * mise à jour d'un clan
     * @param id
     * @param updateClanInput
     * @param req
     * @returns {Promise<*&{createdAt: string, clan_members: *, clan_game: *, _id: *, clan_creator: *, updatedAt: string}>}
     */
    updateClan: async ({id, updateClanInput}, req) => {
        if (!req.isAuth.valid) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        validForm(updateClanInput)
        try {
            const clan = await Clan.findById({_id: id})
            if (!clan) {
                throw new Error(errorName.CLAN_NOT_EXIST)
            } else {
                if (updateClanInput.clan_banner !== '' && updateClanInput.clan_banner !== undefined) {
                    const file = updateClanInput.clan_banner.split('.')
                    const ext = file.pop()
                    updateClanInput.clan_banner = id + '_clan.' + ext
                }
                Clan.findOneAndUpdate(
                    {_id: id},
                    updateClanInput,
                    function (err, doc) {
                        if (err) return res.send(500, {error: err})
                    }
                )
            }

            return transformClan(clan)
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}

