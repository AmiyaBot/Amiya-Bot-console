const sqlBuilder = require('../support/util').sqlBuilder

function Operator (mysql, data, callback) {
    this.getAllOperator = () => {
        const sql = 'select * from t_operator'

        mysql.query(sql, res => {
            callback(res)
        })
    }
    this.getOperatorsByPages = () => {
        const where = sqlBuilder.where(data.search)
        const list = `select * from t_operator ${where} order by operator_id desc limit ${sqlBuilder.pages(data.page, data.pageSize)}`
        const count = `select count(*) as total from t_operator ${where}`
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

module.exports = Operator
