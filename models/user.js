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

const userSchema = new Schema({
        user_avatar: unRequiredString,
        user_login: requiredString,
        user_email: requiredString,
        user_password: requiredString,
        user_discord: unRequiredString,
        user_address: unRequiredString,
        user_zip: unRequiredString,
        user_city: unRequiredString,
        user_gender: unRequiredString,
        user_role: unRequiredString,
        user_state: unRequiredString,
        user_isActive: Boolean,
        user_isDark: Boolean,
        user_createdEvent: [{
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }],
        user_createdClans: [{
            type: Schema.Types.ObjectId,
            ref: 'Clan'
        }],
        user_addedGames: [{
            type: Schema.Types.ObjectId,
            ref: 'Game'
        }],
        user_stream: [{
            type: Schema.Types.ObjectId,
            ref: 'Stream'
        }]
    },
    {timestamps: true}
)

module.exports = mongoose.model('User', userSchema)