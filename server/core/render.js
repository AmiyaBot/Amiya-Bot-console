const fs = require('fs')
const path = require('path')
const util = require('./support/util').util
const Mysql = require('./support/mysql')

function initIndexes () {
    const files = fs.readdirSync(path.resolve(__dirname, './interfaces'))
    const interfaces = []

    for (let file of files) {
        const _controller = require('./interfaces/' + file)
        const _name = file.split('.')[0]

        for (let item of Object.keys(new _controller())) {
            interfaces.push(
                {
                    path: [_name, item],
                    func: _controller
                }
            )
        }
    }
    return interfaces
}

module.exports = (express, databaseConfig) => {
    const mysql = new Mysql(databaseConfig)
    const interfaces = initIndexes()

    for (let item of interfaces) {
        const path = item.path
        const Controller = item.func

        express.post('/' + path.join('/'), (request, responds) => {
            request.on('data', data => {
                data = data.toString()

                console.log('Received HTTP request: ' + path.join('/'))
                console.log(' -- Date: ' + util.formatDate())
                console.log(' -- Post: ' + data)

                const postData = JSON.parse(data)
                const callback = (res, type, msg) => {
                    responds.send({
                        type: (!type && type !== 0) ? 0 : type,
                        data: res === undefined ? null : res,
                        msg: msg || ''
                    })
                }

                try {
                    const init = new Controller(mysql, postData, callback)
                    const funcName = path[1]

                    init[funcName]()
                } catch (e) {
                    console.log(e)
                }
            })
        })
    }
}
