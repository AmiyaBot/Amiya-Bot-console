const util = require('../util').util

function Message (mysql, data, callback) {
    this.getTotalMessage = () => {
        const lastTime = util.lastTime()
        const sql = `select msg_type, count(*) as total from t_message where msg_time >= ${lastTime} GROUP BY msg_type`

        mysql.query(sql, res => {
            callback(res)
        })
    }
    this.getMessageSpeed = () => {
        const start = new Date().getTime() / 1000 - 120
        const end = new Date().getTime() / 1000 - 60
        const sql = `select count(*) as total from t_message where msg_time >= ${start} and msg_time < ${end} and msg_type = 'talk'`

        mysql.query(sql, res => {
            callback(res[0]['total'])
        })
    }
    this.getMessageAnalysis = () => {
        const lastTime = util.lastTime(23)
        const sql = `select * from t_message where msg_time >= ${lastTime}`

        mysql.query(sql, res => {
            let thisTime = new Date().getHours()
            let data = {}

            for (let i = 0; i < 24; i++) {
                if (thisTime === 0) {
                    thisTime = 24
                }
                data[thisTime + ':00'] = {
                    talk: 0,
                    reply: 0,
                    call: 0
                }
                thisTime -= 1
            }

            for (let item of res) {
                let hours = (new Date(item['msg_time'] * 1000).getHours() || 24) + ':00'
                if (hours in data && item['msg_type'] in data[hours]) {
                    data[hours][item['msg_type']] += 1
                }
            }

            callback(data)
        })
    }
}

module.exports = Message
