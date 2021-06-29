const tool = require('../tool')

function Pool (mysql, data, callback) {
    this.getPoolsByPages = () => {
        const where = tool.where(data.search)
        const list = `select * from t_pool ${where} order by pool_id desc limit ${tool.pages(data.page, data.pageSize)}`
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
}

module.exports = Pool
