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
const requiredDate = {
    type: Date,
    required: true
}

const eventSchema = new Schema({
        event_pic: unRequiredString,
        event_name: requiredString,
        event_start: requiredDate,
        event_end: requiredDate,
        event_allDay: {
            type: Boolean
        },
        event_desc: requiredString,
        event_score: unRequiredString,
        event_winner: unRequiredString,
        event_creator: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        user_clan: [{
            type: Schema.Types.ObjectId,
            ref: 'Clan'
        }],
    },
    {timestamps: true}
)

module.exports = mongoose.model('Event', eventSchema)