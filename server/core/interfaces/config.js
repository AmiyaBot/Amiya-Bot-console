function Config (mysql) {
    this.getConfig = (data, callback) => {
        const sql = `select * from t_function`

        mysql.query(sql, res => {
            callback(res)
        })
    }
}

module.exports = Config
