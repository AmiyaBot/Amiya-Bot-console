const openServer = require('./server/server')
openServer(
    8060,
    8010,
    {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'amiya'
    }
)
