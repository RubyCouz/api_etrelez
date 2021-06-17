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

const gameSchema = new Schema({
        game_name: requiredString,
        game_desc: requiredString,
        game_creator: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {timestamps: true}
)

module.exports = mongoose.model('Game', gameSchema)