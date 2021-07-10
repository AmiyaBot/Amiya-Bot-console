const util = require('../support/util')
const sqlBuilder = require('../support/sqlBuilder')

function getActiveUsersCount (mysql, hour = 24, callback) {
    const lastTime = util.lastTime(hour)
    const user = `select * from t_message where msg_time >= ${lastTime} and msg_type = 'reply' GROUP BY reply_user`
    const sql = `select count(*) as total from (${user}) as user`

    mysql.query(sql, res => {
        callback(res[0]['total'])
    })
}

function User (mysql) {
    this.getActiveUsers = (data, callback) => {
        getActiveUsersCount(mysql, 24, res => {
            callback(res)
        })
    }
    this.getUserSignData = (data, callback) => {
        const sql = `select count(*) as total from t_user where sign_in = 1`

        let hours = new Date().getHours() - 4
        if (hours < 0) {
            hours = 24 + hours
        }

        getActiveUsersCount(mysql, hours, count => {
            mysql.query(sql, res => {
                const rsp = [count, res[0]['total']]
                callback(rsp)
            })
        })
    }
    this.getUsersByPages = (data, callback) => {
        const sql = sqlBuilder.queryPages(
            't_user',
            data.search,
            data.page,
            data.pageSize,
            'order by sign_in desc, user_feeling desc'
        )

        mysql.queryOneStage(sql, res => {
            const rsp = {
                data: res.data,
                count: res.count[0]['total']
            }
            callback(rsp)
        })
    }
    this.setBlackUser = (data, callback) => {
        const sql = `update t_user set black = ${data['black']} where user_id = "${data['user_id']}"`
        mysql.query(sql, res => {
            if (res.affectedRows) {
                callback(res, 0, '修改成功')
                return
            }
            callback(res, 1, '修改失败')
        })
    }
    this.sendCoupon = (data, callback) => {
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
