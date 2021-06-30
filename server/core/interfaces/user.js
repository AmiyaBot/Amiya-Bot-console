const util = require('../util').util
const sqlBuilder = require('../util').sqlBuilder

function User (mysql, data, callback) {
    this.getActiveUsers = (hour = 24, selfCallback) => {
        const lastTime = util.lastTime(hour)
        const user = `select * from t_message where msg_time >= ${lastTime} and msg_type = 'reply' GROUP BY reply_user`
        const sql = `select count(*) as total from (${user}) as user`

        mysql.query(sql, res => {
            if (selfCallback) {
                selfCallback(res[0]['total'])
                return
            }
            callback(res[0]['total'])
        })
    }
    this.getUserSignData = () => {
        const sql = `select count(*) as total from t_user where sign_in = 1`

        let hours = new Date().getHours() - 4
        if (hours < 0) {
            hours = 24 + hours
        }

        this.getActiveUsers(hours, count => {
            mysql.query(sql, res => {
                const rsp = [count, res[0]['total']]
                callback(rsp)
            })
        })
    }
    this.getUsersByPages = () => {
        const where = sqlBuilder.where(data.search)
        const list = `select * from t_user ${where} order by sign_in desc, user_feeling desc limit ${sqlBuilder.pages(data.page, data.pageSize)}`
        const count = `select count(*) as total from t_user ${where}`
        const sql = {
            data: list,
            count: count
        }

        mysql.queryOneStage(sql, data => {
            const rsp = {
                data: data.data,
                count: data.count[0]['total']
            }
            callback(rsp)
        })
    }
}

module.exports = User
