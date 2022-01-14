const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {graphqlHTTP} = require('express-graphql')
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolver = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
const cookieParser = require('cookie-parser');
const upload = require('./upload/upload')
const getErrorCode = require('./errors/errors')
const {createServer} = require('http')
const {Server} = require('socket.io')
const {REFRESH_TOKEN_KEY, TOKEN_KEY} = require('./helpers/tokenKey')
const {DB, DB_USER, DB_PASSWORD, DB_SPACE, HOST} = require('./config')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: HOST,
        methods: ["GET", "POST"],
        credentials: true
    }
});
let users = []
io.on('connection', (socket) => {
    socket.on('online', async function (data) {
        const decodedToken = jwt.verify(data.token, TOKEN_KEY)
        users[socket.id] = decodedToken.userId
        const updateUserInput = {
            user_isOnline: true
        }
        await User.findOneAndUpdate({_id: decodedToken.userId}, updateUserInput)
        const user = await User.findOne({_id: decodedToken.userId})
        io.emit('isOnline', {isOnline: user.user_isOnline, userId: user._id})


    })
    socket.on('offline', async function (data) {
        const updateUserInput = {
            user_isOnline: false
        }
        await User.findOneAndUpdate({_id: data.userId}, updateUserInput)
        const user = await User.findOne({_id: data.userId})
        io.emit('isOnline', {isOnline: user.user_isOnline, userId: user._id})
    })
    // socket.on('disconnect', function() {
    //     const updateUserInput = {
    //         user_isOnline: false
    //     }
    // })
})


app.use(express.static(__dirname + '/Public'))
app.use(cookieParser())
app.use((req, res, next) => {
    const allowedOrigins = ['https://rubycouz.cc', 'http://localhost:3000']
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})
app.use(bodyParser.json())
app.use(isAuth)
app.use('/api', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn: (err) => {
        console.log('err : ' + err)
        const error = getErrorCode(err.message)
        return ({message: error.message, statusCode: error.statusCode})
    }
}))
app.post('/upload/clan/:id', upload)
app.post('/upload/game/:id', upload)
app.post('/upload/event/:id', upload)
app.post('/upload/users/avatar/:id', upload)
app.post('/upload/users/banner/:id', upload)
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_SPACE}.2zwgz.mongodb.net/${DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
            httpServer.listen(5000)
        }
    )
    .catch(err => {
        console.log(err)
    })
