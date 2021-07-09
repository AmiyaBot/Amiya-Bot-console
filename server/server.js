const express = require('express')
const session = require('express-session')
const render = require('./core/render')
const Mysql = require('./core/support/mysql')
const auth = require('./core/auth')

function openServer (database, port = 8000) {
    const app = express()
    const mysql = new Mysql(database)

    console.log('\x1B[36m%s\x1b[0m', 'Server starting on http://127.0.0.1:' + port)
    console.log('\n')

    app.use(express.static('dist')).listen(port)
    app.use(session({
        secret: 'amiya_server',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 3600000
        }
    }))

    auth(app, mysql)
    render(app, mysql)
}

module.exports = openServer
