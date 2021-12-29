const Event = require('../../models/event')
const User = require('../../models/user')
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
        console.log(args.eventInput)
        validForm(args.eventInput)
        const event = new Event({
            event_pic: args.eventInput.event_pic,
            event_name: args.eventInput.event_name,
            event_desc: args.eventInput.event_desc,
            event_start: new Date(args.eventInput.event_start),
            event_end: new Date(args.eventInput.event_end),
            event_allDay: args.eventInput.event_allDay,
            event_creator: req.isAuth.userId
        })
        let createdEvent
        try {
            const result = await event.save()
            let picName
            if (args.eventInput.event_pic !== '') {
                const file = args.eventInput.event_pic.split('.')
                const ext = file.pop()
                picName = result._id + '_event.' + ext
            }
            const updateEventInput = {event_pic: picName}
            Event.findOneAndUpdate({
                    _id: event._id,
                },
                updateEventInput,
                function (err, doc) {
                    console.log(err)
                    if (err) return res.send(500, {error: err})
                }
            )
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
            throw new Error(errorName.PERMISSION_ERROR)
        }

        //trouve id via le FindByID (id dans index rootmutation est égal à _id dans Event)
        const event = await Event.findById({_id: args.id})
        if(!event) {
            throw new Error(errorName.EVENT_NOT_EXIST)
        }
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
        try {
            //trouve id via le FindByID (id dans index rootmutation est égal à _id dans Event)
            const event = await Event.findById({_id: id})
            if(!event) {
                throw new Error(errorName.EVENT_NOT_EXIST)
            } else {
                console.log(updateEventInput.event_pic)
                if(updateEventInput.event_pic !== '' && updateEventInput.event_pic !== undefined) {
                    const file = updateEventInput.event_pic.split('.')
                    const ext = file.pop()
                    updateEventInput.event_pic = id + '_event.' + ext
                }
            }
            //trouve id via le FindByID (id dans index rootmutation est égal à _id dans Event)
            Event.findOneAndUpdate({_id: id},
                updateEventInput,
                function (err, doc) {
                    if (err) return res.send(500, {error: err});
                }
            )
            //retourne l'event par l'id
            return transformEvent(event)
        } catch (err) {
            throw err
        }
    },
}