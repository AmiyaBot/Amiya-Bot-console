const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const render = require('./core/render')

function openServer (databaseConfig, port = 8000) {
    const app = express()

    console.log('\x1B[36m%s\x1b[0m', 'Server starting on http://127.0.0.1:' + port)
    console.log('\n')

    app.use(express.static('dist')).listen(port)
    app.use(session({
        secret: 'amiyaServer',
        store: new FileStore(),
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 10000
        }
    }))

    app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        if (req.method === 'OPTIONS') {
            res.sendStatus(200)
        } else {
            next()
        }
    })

    render(app, databaseConfig)
}

module.exports = openServer
