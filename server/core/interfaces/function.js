function Function (mysql) {
    this.getFunctionUsed = (data, callback) => {
        const sql = `select * from t_function`

        mysql.query(sql, res => {
            callback(res)
        })
    }
}

module.exports = Function
