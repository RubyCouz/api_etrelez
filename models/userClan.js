const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userClanSchema = new Schema({
        user: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        clan: [{
            type: Schema.Types.ObjectId,
            ref: 'Clan'
        }],
    },
    {timestamps: true}
)

module.exports = mongoose.model('UserClan', userClanSchema)