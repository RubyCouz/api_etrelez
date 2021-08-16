const Event = require('../../models/event')
const User =require('../../models/user')
const {Schema} = require("mongoose");
const {transformEvent} = require('./merge')


module.exports = {
    /**
     * list d'events
     * @returns {Promise<*>}
     */
    events: async () => {
        try {
            const events = await Event.find() // populate => récupération des infos des relations (fonctionnalité mongoose)
            return events.map(event => {
                return transformEvent(event)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * création d'un event
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    createEvent: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        // if(!req.isAuth) {
        //     throw new Error('Unauthenticated !!!')
        // }
        const event = new Event({
            event_name: args.eventInput.event_name,
            event_desc: args.eventInput.event_desc,
            event_date: new Date(args.eventInput.event_date),
            event_creator: req.userId
        })
        let createdEvent

        try {
            const result = await event
                .save()
            createdEvent = transformEvent(result)
            const creator = await User.findById(req.userId)

            if (!creator) {
                throw new Error('User not found !!!')
            }
            creator.user_createdEvent.push(event)
            await creator.save()
            return createdEvent
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    //Mutatation suppression d'un event
    /**
     *
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    deleteEvent :async (args,req) => {

       // console.log(args)

        // trouve id via le FindByID (id dans index rootmutation est égal à _id dans Event)
        const event = await Event.findById({_id: args.id})
        // console.log(event)
        event.remove()


    },
}