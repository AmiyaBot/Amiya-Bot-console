function Operator (mysql, data, callback) {
    this.getAllOperator = () => {
        const sql = 'select * from t_operator'

        mysql.query(sql, res => {
            callback(res)
        })
    }
}

module.exports = Operator
