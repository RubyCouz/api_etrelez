const Engagement = require ('../../models/engagement')
const Event = require('../../models/event')
const {transformEngagement, transformEvent} = require('./merge')

module.exports = {
    /**
     * liste des events auxquels participe un membre
     * @param args
     * @param req
     * @returns {Promise<*>}
     */
    engagement: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const engagements = await Engagement.find({engagement_user: req.userId})
            return engagements.map(booking => {
                return transformEngagement(booking)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * rejoindre un event
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    joinEvent: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId})
        const joining = new Engagement({
            user: req.userId,
            event: fetchedEvent
        })
        const result = await joining.save()
        return transformEngagement(joining)

    },
    /**
     * annulation participation à un event
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    cancelJoining: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const engagement = await Engagement.findById(args.engagementId).populate('event')
            const event = transformEvent(engagement.event)
            await Engagement.deleteOne({
                _id: args.engagementId
            })
            return event
        } catch (e) {
            throw e
        }
    }
}
