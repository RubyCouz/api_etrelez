const mongoose = require('mongoose')

const Schema = mongoose.Schema

const engagementSchema = new Schema({
        engagement_user: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        engagement_event: [{
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }],
    },
    {timestamps: true}
)

module.exports = mongoose.model('Engagement', engagementSchema)