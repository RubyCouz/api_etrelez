const User = require('../../models/user')
const Clan = require('../../models/clan')
const Event = require('../../models/event')
const Stream = require('../../models/stream')
const Game = require('../../models/game')
const {dateToString} = require('../../helpers/date')

const DataLoader = require('dataloader')

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds)
})

const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds}})
})

const clanLoader = new DataLoader((clanIds) => {
    return clans(clanIds)
})

const streamLoader = new DataLoader((streamIds) => {
    return streams(streamIds)
})

const gameLoader = new DataLoader((gameIds) => {
    return streams(gameIds)
})

// relation entre les schema : permet de récupérer els information d'un schema au sein d'un autre
const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})

        events.sort((a, b) => {
            return (
                eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
            )
        })
        console.log(events, eventIds)
        return events.map(event => {
            return transformEvent(event)
        })
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        return await eventLoader.load(eventId.toString())
    } catch (err) {
        throw err
    }
}

const users = async userIds => {
    try {
        const users = await User.find({_id: {$in: userIds}})

        events.sort((a, b) => {
            return (
                userIds.indexOf(a._id.toString()) - userIds.indexOf(b._id.toString())
            )
        })
        console.log(users, userIds)
        return clans.map(user => {
            return transformUser(user)
        })
    } catch (err) {
        throw err
    }
}

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString()) // convertion des ids en string

        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        }
    } catch (err) {
        throw err
    }
}

const clans = async clanIds => {
    try {
        const clans = await Clan.find({_id: {$in: clanIds}})

        events.sort((a, b) => {
            return (
                clanIds.indexOf(a._id.toString()) - clanIds.indexOf(b._id.toString())
            )
        })
        console.log(clans, clanIds)
        return clans.map(clan => {
            return transformClan(clan)
        })
    } catch (err) {
        throw err
    }
}

const singleClan = async clanId => {
    try {
        return await clanLoader.load(clanId.toString())
    } catch (err) {
        throw err
    }
}

const games = async gameIds => {
    try {
        const games = await Game.find({_id: {$in: gameIds}})

        events.sort((a, b) => {
            return (
                gameIds.indexOf(a._id.toString()) - gameIds.indexOf(b._id.toString())
            )
        })
        console.log(games, gameIds)
        return games.map(game => {
            return transformGame(game)
        })
    } catch (err) {
        throw err
    }
}

const streams = async streamIds => {
    try {
        const streams = await Stream.find({_id: {$in: streamIds}})

        events.sort((a, b) => {
            return (
                streamIds.indexOf(a._id.toString()) - streamIds.indexOf(b._id.toString())
            )
        })
        console.log(streams, streamIds)
        return streams.map(stream => {
            return transformStream(stream)
        })
    } catch (err) {
        throw err
    }
}

const singleStream = async streamId => {
    try {
        return await streamLoader.load(streamId.toString())
    } catch (err) {
        throw err
    }
}

const singleGame = async gameId => {
    try {
        return await gameLoader.load(gameId.toString())
    } catch (err) {
        throw err
    }
}

const transformUser = userObject => {
    return {
        ...userObject._doc,
        _id: userObject.id,
        user_createdEvent: user.bind(this, userObject._doc.event_creator),
        user_clan: user.bind(this, userObject._doc.user_clan),
        user_stream: user.bind(this, userObject._doc.user_stream),
        user_game_played: user.bind(this, userObject._doc.user_game_played),
        createdAt: dateToString(userObject._doc.createdAt),
        updatedAt: dateToString(userObject._doc.createdAt)
    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        event_date: new Date(event._doc.event_date).toISOString(),
        event_creator: user.bind(this, event.event_creator),
        createdAt: dateToString(event._doc.createdAt),
        updatedAt: dateToString(event._doc.createdAt)
    }
}

const transformEngagement = engagement => {
    return {
        ...engagement._doc,
        _id: engagement.id,
        engagement_user: user.bind(this, engagement._doc.engagement_user),
        engagement_event: singleEvent.bind(this, engagement._doc.engagement_event),
        createdAt: dateToString(engagement._doc.createdAt),
        updatedAt: dateToString(engagement._doc.createdAt)
    }
}

const transformUserStream = userStream => {
    return {
        ...userStream._doc,
        _id: userStream.id,
        user: user.bind(this, userStream._doc.user),
        stream: singleStream.bind(this, userStream._doc.stream),
        createdAt: dateToString(userStream._doc.createdAt),
        updatedAt: dateToString(userStream._doc.createdAt)
    }
}

const transformClanGame = clanGame => {
    return {
        ...clanGame._doc,
        _id: clanGame.id,
        clan: user.bind(this, clanGame._doc.clan),
        game: singleGame.bind(this, clanGame._doc.game),
        createdAt: dateToString(clanGame._doc.createdAt),
        updatedAt: dateToString(clanGame._doc.createdAt)
    }
}

const transformUserClan = userClan => {
    return {
        ...userClan._doc,
        _id: userClan.id,
        user: user.bind(this, userClan._doc.user),
        clan: singleClan.bind(this, userClan._doc.clan),
        createdAt: dateToString(userClan._doc.createdAt),
        updatedAt: dateToString(userClan._doc.createdAt)
    }
}

const transformUserGame = userGame => {
    return {
        ...userGame._doc,
        _id: userGame.id,
        user: user.bind(this, userGame._doc.user),
        game: singleEvent.bind(this, userGame._doc.game),
        createdAt: dateToString(userGame._doc.createdAt),
        updatedAt: dateToString(userGame._doc.createdAt)
    }
}
const transformClan = clan => {
    return {
        ...clan._doc,
        _id: clan.id,
        clan_members: user.bind(this, clan._doc.clan_members),
        clan_game: games.bind(this, clan._doc.clan_game)
    }
}

const transformGame = game => {
    return {
        ...game._doc,
        _id: game.id,
        game_players: user.bind(this, game._doc.game_players),
        createdAt: dateToString(game._doc.createdAt),
        updatedAt: dateToString(game._doc.createdAt)
    }
}

const transformStream = stream => {
    return {
        ...stream._doc,
        _id: stream.id,
        stream_players: streams.bind(this, stream._doc.stream_players)
    }
}

exports.transformEvent = transformEvent
exports.transformEngagement = transformEngagement
exports.transformClan = transformClan
exports.transformGame = transformGame
exports.transformUser = transformUser