const sqlBuilder = require('../util').sqlBuilder

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
        const sql = `insert into t_pool (${Object.keys(data).join(', ')}) values ("${Object.values(data).join('", "')}")`
        mysql.query(sql, res => {
            if (res.affectedRows) {
                callback(res)
                return
            }
            callback(res, 1, '添加失败')
        })
    }
}

module.exports = Pool
