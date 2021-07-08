function Config (mysql, data, callback) {
    this.getConfig = () => {
        const sql = `select * from t_function`

        mysql.query(sql, res => {
            callback(res)
        })
    }
}

module.exports = Config
