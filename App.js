const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {graphqlHTTP} = require('express-graphql')
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolver = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
const cookieParser = require('cookie-parser');
const upload = require('./upload/upload')
const getErrorCode = require("./errors/errors");
const app = express()

app.use(express.static(__dirname + '/Public'))

app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
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
        console.log(err)
        if (err !== undefined || typeof err !== undefined) {
            const error = getErrorCode(err.message)
            console.log(error)
                return ({message: error.message, status: error.statusCode})
            }
    }
}))

app.post('/upload/game', upload)
app.post('/upload/event', upload)
app.post('/upload/profilePic', upload)
mongoose.connect(`mongodb://localhost:27017/EterelZ?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
            app.listen(8080)
        }
    )
    .catch(err => {
        console.log(err)
    })