const sqlBuilder = require('../support/util').sqlBuilder

function Pool (mysql, data, callback) {
    this.getPoolsByPages = () => {
        const sql = sqlBuilder.queryPages(
            't_pool',
            data.search,
            data.page,
            data.pageSize,
            'order by pool_id desc'
        )

        mysql.queryOneStage(sql, res => {
            const rsp = {
                data: res.data,
                count: res.count[0]['total']
            }
            callback(rsp)
        })
    }
    this.addNewPool = () => {
        const check = `select * from t_pool where pool_name = "${data['pool_name']}"`
        mysql.query(check, res => {
            if (res.length) {
                callback(res, 1, '已存在同名卡池')
                return
            }

            mysql.query(sqlBuilder.insert('t_pool', data), res => {
                if (res.affectedRows) {
                    callback(res, 0, '成功添加卡池：' + data['pool_name'])
                    return
                }
                callback(res, 1, '添加失败')
            })
        })
    }
    this.editPool = () => {
        mysql.query(sqlBuilder.update('t_pool', data, {pool_name: data['pool_name']}), res => {
            if (res.affectedRows) {
                callback(res, 0, '修改成功')
                return
            }
            callback(res, 1, '修改失败')
        })
    }
    this.delPool = () => {
        mysql.query(sqlBuilder.delete('t_pool', {pool_name: data['pool_name']}), res => {
            if (res.affectedRows) {
                callback(res, 0, '删除成功')
                return
            }
            callback(res, 1, '删除失败')
        })
    }
    this.getConfigByPages = () => {
        const sql = sqlBuilder.queryPages(
            't_operator_gacha_config',
            data.search,
            data.page,
            data.pageSize,
            'order by id desc'
        )

        mysql.queryOneStage(sql, res => {
            const rsp = {
                data: res.data,
                count: res.count[0]['total']
            }
            callback(rsp)
        })
    }
    this.addNewConfig = () => {
        mysql.query(sqlBuilder.insert('t_operator_gacha_config', data), res => {
            if (res.affectedRows) {
                callback(res, 0, '添加成功')
                return
            }
            callback(res, 1, '添加失败')
        })
    }
    this.editConfig = () => {
        mysql.query(sqlBuilder.update('t_operator_gacha_config', data, {id: data['id']}), res => {
            if (res.affectedRows) {
                callback(res, 0, '修改成功')
                return
            }
            callback(res, 1, '修改失败')
        })
    }
    this.delConfig = () => {
        mysql.query(sqlBuilder.delete('t_operator_gacha_config', {id: data['id']}), res => {
            if (res.affectedRows) {
                callback(res, 0, '删除成功')
                return
            }
            callback(res, 1, '删除失败')
        })
    }
}

module.exports = Pool
