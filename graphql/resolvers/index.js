const authResolver =  require('./auth')
const eventResolver = require('./events')
const engagementResolver = require('./engagements')
const clanResolver = require('./clans')
const streamResolver = require('./streams')
const gameResolver = require('./games')

const rootResolver = {
    ...authResolver,
    ...clanResolver,
    ...engagementResolver,
    ...gameResolver,
    ...streamResolver,
    ...eventResolver
}

module.exports = rootResolver