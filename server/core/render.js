const Mysql = require('./mysql')
const util = require('./util').util

const interfaces = [
    'message/getTotalMessage',
    'message/getMessageSpeed',
    'message/getMessageAnalysis',
    'user/getActiveUsers',
    'user/getUserSignData',
    'user/getUsersByPages',
    'function/getFunctionUsed',
    'operator/getAllOperator',
    'pool/addNewPool',
    'pool/getPoolsByPages'
]

module.exports = (express, databaseConfig) => {
    const mysql = new Mysql(databaseConfig)

    for (let name of interfaces) {
        const path = name.split('/')
        const controller = callInterfaces(path[0])

        express.post('/' + name, (request, responds) => {
            request.on('data', data => {
                data = data.toString()

                console.log('Received HTTP request: ' + name)
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
                    // eslint-disable-next-line new-cap
                    const init = new controller(mysql, postData, callback)

                    init[path[1]]()
                } catch (e) {
                    console.log(e)
                }
            })
        })
    }
}

function callInterfaces (name) {
    return require('./interfaces/' + name)
}
