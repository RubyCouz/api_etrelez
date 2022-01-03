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
const app = express()
app.use(express.static(__dirname + '/Public'))

app.use(cookieParser())
app.use((req, res, next) => {
    const allowedOrigins = ['https://rubycouz.xyz', 'http://localhost:3000']
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
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
        console.log('err : ' + err)
    const error = getErrorCode(err.message)
    return ({ message: error.message, statusCode: error.statusCode })
}
}))

app.post('/upload/clan/:id', upload)
app.post('/upload/game/:id', upload)
app.post('/upload/event/:id', upload)
app.post('/upload/profilePic/:id', upload)
mongoose.connect(`mongodb+srv://RubyCouz:RubyCouz2805@eterelz.2zwgz.mongodb.net/Eterelz?retryWrites=true&w=majority`, {
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