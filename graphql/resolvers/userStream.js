const UserStream = require ('../../models/userStream')
const Stream = require('../../models/stream')
const {transformUserStream, transformStream} = require('./merge')

module.exports = {
    /**
     * liste des streams que possède un membre
     * @param args
     * @param req
     * @returns {Promise<*>}
     */
    userStream: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const userStreams = await UserStream.find({engagement_user: req.userId})
            return userStreams.map(userStream => {
                return transformUserStream(userStream)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * joindre un stream à un membre
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    joinStream: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth) {
            throw new Error('Unauthenticated !!!')
        }
        const fetchedStream = await Stream.findOne({_id: args.streamId})
        const joining = new Stream({
            user: req.userId,
            stream: fetchedStream
        })
        const result = await joining.save()
        return transformUserStream(joining)

    },
    /**
     * annulation participation à un event
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    cancelJoinStream: async (args, req) => {
        // vérification de l'authentification => si l'utilisateur n'est pas connecté
        if(!req.isAuth) {
            throw new Error('Unauthenticated !!!')
        }
        try {
            const userStream = await UserStream.findById(args.userStreamId).populate('stream')
            const stream = transformStream(userStream.stream)
            await UserStream.deleteOne({
                _id: args.userStreamId
            })
            return stream
        } catch (e) {
            throw e
        }
    }
}
