const util = require('./util')
const sqlBuilder = require('./sqlBuilder')

function handler (options, callback) {
    const mysql = options.mysql
    const req = options.req
    const res = options.res

    req.on('data', data => {
        data = data.toString()

        console.log('Received HTTP request: ' + req.url)
        console.log(' -- Date: ' + util.formatDate())
        console.log(' -- Post: ' + data)

        mysql.query(sqlBuilder.insert('t_console_log', {
            user_id: req.session.user_id,
            path: req.url,
            payload: encodeURI(data),
            time: (new Date().getTime() / 1000).toFixed()
        }))

        try {
            callback(
                JSON.parse(data),
                (data, type, msg) => {
                    return res.send({
                        type: (!type && type !== 0) ? 0 : type,
                        data: data === undefined ? null : data,
                        msg: msg || ''
                    })
                }
            )
        } catch (e) {
            console.log('Handler Error: ' + e.toString())
        }
    })
}

module.exports = handler
