function Operator (mysql) {
    this.getAllOperator = (data, callback) => {
        const sql = 'select * from t_operator'

        mysql.query(sql, res => {
            callback(res)
        })
    }
}

module.exports = Operator
