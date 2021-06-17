const mongoose = require('mongoose')

const Schema = mongoose.Schema

const requiredString = {
    type: String,
    required: true
}
const unRequiredString = {
    type: String,
    required: false
}

const streamSchema = new Schema({
        stream_url: requiredString,
        stream_support: requiredString,
        stream_players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {timestamps: true}
)

module.exports = mongoose.model('Stream', streamSchema)