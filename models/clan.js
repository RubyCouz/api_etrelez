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

const clanSchema = new Schema({
        clan_name: requiredString,
        clan_desc: requiredString,
        clan_banner: unRequiredString,
        clan_discord: unRequiredString,
        clan_population: {
            type: Number,
            required: false
        },
        clan_recrut: unRequiredString,
        clan_activity: unRequiredString,
        clan_creator: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]

    },
    {timestamps: true}
)

module.exports = mongoose.model('Clan', clanSchema)