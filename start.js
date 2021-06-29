const openServer = require('./server/server')
const mysql = {
    host: '',
    port: '',
    user: '',
    password: '',
    database: ''
}

openServer(8060, 8010, mysql)
