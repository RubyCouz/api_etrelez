const Stream = require('../../models/stream')
const User = require('../../models/user')
const {transformStream} = require('./merge')

module.exports = {
    /**
     * liste des streams
     * @returns {Promise<*>}
     */
    streams: async () => {
        try {
            const streams = await Stream.find()
            return streams.map(stream => {
                return transformStream(stream)
            })
        } catch (err) {
            throw err
        }
    },
    /**
     * ajout d'un stream
     * @param args
     * @param req
     * @returns {Promise<{[p: string]: *}>}
     */
    createStream: async (args, req) => {
        if (req.isAuth) {
            throw new Error('Vous devez être connecté pour effectuer cette action !!!')
        }

        const stream = new Stream({
            stream_url: args.streamInput.stream_url,
            stream_support: args.streamInput.stream_support
        })
        let createdStream

        try {
            const result = await stream.save()
            createdStream = transformStream(result)
            const streamer = await User.findById(req.userId)

            if (!streamer) {
                throw new Error('User not found')
            }
            streamer.user_stream.push(result)
            await streamer.save()
            return createdStream
        } catch (err) {
            throw err
        }
    },
}
