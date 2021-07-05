const util = require('../support/util').util
const sqlBuilder = require('../support/util').sqlBuilder

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
    this.setBlackUser = () => {
        const sql = `update t_user set black = ${data['black']} where user_id = "${data['user_id']}"`
        mysql.query(sql, res => {
            if (res.affectedRows) {
                callback(res, 0, '修改成功')
                return
            }
            callback(res, 1, '修改失败')
        })
    }
    this.sendCoupon = () => {
        let sql = `update t_user set coupon = coupon + ${data['value']}`

        if (data['users'].length) {
            sql += ` where user_id in ("${data['users'].join('", "')}")`
        }

        mysql.query(sql, res => {
            if (res.affectedRows) {
                callback(res, 0, '发放成功')
                return
            }
            callback(res, 1, '发放失败')
        })
    }
}

module.exports = User
