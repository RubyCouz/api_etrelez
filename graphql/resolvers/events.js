const Event = require('../../models/event')
const User = require('../../models/user')
const {Schema} = require("mongoose");
const {transformEvent} = require('./merge')
const {errorName} = require("../../errors/errorConstant");
const {validForm} = require("../../middleware/validForm");


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
     *
     * @param args
     * @param req
     * @returns {Promise<*&{createdAt: string, event_date: string, event_creator: *, _id: *, updatedAt: string}>}
     */
    createEvent: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if (!req.isAuth.valid) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        validForm(args.eventInput)
        const event = new Event({
            event_name: args.eventInput.event_name,
            event_desc: args.eventInput.event_desc,
            event_date: new Date(args.eventInput.event_date),
            event_creator: req.isAuth.userId
        })
        let createdEvent

        try {
            const result = await event
                .save()
            createdEvent = transformEvent(result)
            const creator = await User.findById(req.isAuth.userId)

            if (!creator) {
                throw new Error(errorName.ERROR_USER)
            }
            creator.user_createdEvent.push(event)
            await creator.save()
            return createdEvent
        } catch (err) {
            throw err
        }
    },
    /**
     * suppression d'un event
     * @param args
     * @param req
     * @returns {Promise<*&{createdAt: string, event_date: string, event_creator: *, _id: *, updatedAt: string}>}
     */
    deleteEvent: async (args, req) => {
        if (!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }

        //trouve id via le FindByID (id dans index rootmutation est égal à _id dans Event)
        const event = await Event.findById({_id: args.id})

        try {
            event.remove()
            return transformEvent(event)
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    /**
     * Mise à jour d'un event
     * @param id
     * @param updateEventInput
     * @param req
     * @returns {Promise<*&{createdAt: string, event_date: string, event_creator: *, _id: *, updatedAt: string}>}
     */
    updateEvent: async ({id, updateEventInput}, req) => {
        if (!req.isAuth.valid) {
            throw new Error('Unauthenticated !!!')
        }
        validForm(updateEventInput)
        //trouve id via le FindByID (id dans index rootmutation est égal à _id dans Event)
        const event = await Event.findById({_id: id})
        try {
            //trouve id via le FindByID (id dans index rootmutation est égal à _id dans Event)
            Event.findOneAndUpdate({_id: id},
                updateEventInput,
                function (err, doc) {
                    if (err) return res.send(500, {error: err});
                }
            );

            //retourne l'event par l'id
            return transformEvent(event)
        } catch (err) {
            console.log(err)
            throw err
        }
    },

}