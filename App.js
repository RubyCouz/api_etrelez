const express = require('express')
const bodyParser = require ('body-parser')
const mongoose = require ('mongoose')
const {graphqlHTTP} = require ('express-graphql')
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolver = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(bodyParser.json())
app.use(isAuth)
app.use('/api', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}))
mongoose.connect(`mongodb://localhost:27017/EterelZ?readPreference=primary&appname=MongoDB%20Compass&ssl=false`)
    .then(() => {
            app.listen(8080)
        }
    )
    .catch(err => {
        console.log(err)
    })