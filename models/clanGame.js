const mongoose = require('mongoose')

const Schema = mongoose.Schema

const clanGameSchema = new Schema({
        clan: [{
            type: Schema.Types.ObjectId,
            ref: 'Clan'
        }],
        game: [{
            type: Schema.Types.ObjectId,
            ref: 'Game'
        }],
    },
    {timestamps: true}
)

module.exports = mongoose.model('clanGame', clanGameSchema)