function Function (mysql, data, callback) {
    this.getFunctionUsed = () => {
        const sql = `select * from t_function`

        mysql.query(sql, res => {
            callback(res)
        })
    }
}

module.exports = Function
