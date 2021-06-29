const mysql = require('mysql')

function Mysql (config) {
    const handleDisconnection = () => {
        let connection = mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database
        })
        connection.connect(err => {
            if (err) setTimeout(handleDisconnection, 2000)
        })
        connection.on('error', err => {
            console.log('Database error:', err)
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Database reconnect:', err.message)
                handleDisconnection()
            } else {
                throw err
            }
        })

        clearInterval(ping)
        ping = setInterval(() => {
            connection.ping(err => {
                if (err) {
                    console.log('Ping error: ' + JSON.stringify(err))
                }
            })
        }, 30000)

        this.connections = connection
    }
    let ping = null

    this.connections = null

    handleDisconnection()

    /**
     * 异步查询，以回调形式返回结果
     * @param sql
     * @param callback
     */
    this.query = (sql, callback) => {
        this.connections.query(sql, (error, results) => {
            if (error) throw error
            if (callback) callback(JSON.parse(JSON.stringify(results)))
        })
    }

    /**
     * 同步查询，以 await 直接返回结果
     * @param sql
     * @returns {Promise<any>}
     */
    this.syncQuery = (sql) => {
        return new Promise(resolve => this.query(sql, res => resolve(res)))
    }

    /**
     * 查询一组语句
     * @param sqlList {object} 格式: {res1: sql, res2: sql,...}
     * @param callback {function} 查询结果会以 sqlList 相同的格式返回到回调函数
     * @return {Promise<void>}
     */
    this.queryOneStage = async (sqlList, callback) => {
        let data = {}
        for (let i in sqlList) {
            data[i] = await this.syncQuery(sqlList[i])
        }
        callback(data)
    }

    /**
     * 查询多组语句
     * @param sqlList {object} 格式: {group1: {res1: sql, res2: sql,...},...}
     * @param callback {function} 查询结果会以 sqlList 相同的格式返回到回调函数
     * @returns {Promise<void>}
     */
    this.queryManyStage = async (sqlList, callback) => {
        let data = {}
        for (let i in sqlList) {
            data[i] = {}
            for (let n in sqlList[i]) {
                data[i][n] = await this.syncQuery(sqlList[i][n])
            }
        }
        callback(data)
    }
}

module.exports = Mysql
