const sqlBuilder = require('../support/util').sqlBuilder

function Pool (mysql, data, callback) {
    this.getPoolsByPages = () => {
        const where = sqlBuilder.where(data.search)
        const list = `select * from t_pool ${where} order by pool_id desc limit ${sqlBuilder.pages(data.page, data.pageSize)}`
        const count = `select count(*) as total from t_pool ${where}`
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
    this.addNewPool = () => {
        const check = `select * from t_pool where pool_name = "${data['pool_name']}"`
        mysql.query(check, res => {
            if (res.length) {
                callback(res, 1, '已存在同名卡池')
                return
            }

            const sql = `insert into t_pool (${Object.keys(data).join(', ')}) values ("${Object.values(data).join('", "')}")`
            mysql.query(sql, res => {
                if (res.affectedRows) {
                    callback(res, 0, '成功添加卡池：' + data['pool_name'])
                    return
                }
                callback(res, 1, '添加失败')
            })
        })
    }
    this.editPool = () => {
        const set = []
        for (let field in data) {
            set.push(`${field} = "${data[field]}"`)
        }
        const sql = `update t_pool set ${set.join(', ')} where pool_name = "${data['pool_name']}"`
        mysql.query(sql, res => {
            if (res.affectedRows) {
                callback(res, 0, '修改成功')
                return
            }
            callback(res, 1, '修改失败')
        })
    }
    this.delPool = () => {
        const sql = `delete from t_pool where pool_name = "${data['pool_name']}"`
        mysql.query(sql, res => {
            if (res.affectedRows) {
                callback(res, 0, '删除成功')
                return
            }
            callback(res, 1, '删除失败')
        })
    }
}

module.exports = Pool
