const express = require('express')
const interfaces = require('./core/interfaces')

function openServer (viewPort, httpPort, databaseConfig) {
    const app = express()
    const HttpRequest = express()

    console.log('\x1B[36m%s\x1b[0m', 'Server starting on http://127.0.0.1:' + viewPort)
    console.log('\n')

    app.use(express.static('dist')).listen(viewPort)

    HttpRequest.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        if (req.method === 'OPTIONS') {
            res.send(200)
        } else {
            next()
        }
    })
    HttpRequest.listen(httpPort)

    interfaces(HttpRequest, databaseConfig)
}

module.exports = openServer
