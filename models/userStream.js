const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userStreamSchema = new Schema({
        user: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        stream: [{
            type: Schema.Types.ObjectId,
            ref: 'Stream'
        }],
    },
    {timestamps: true}
)

module.exports = mongoose.model('UserStream', userStreamSchema)