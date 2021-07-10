const handler = require('./support/handler')

function auth (app, mysql) {
    app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        if (req.method === 'OPTIONS') {
            res.sendStatus(200)
        } else {
            next()
        }
    })

    app.use(function (req, res, next) {
        if (req.session.user_id === undefined && req.url !== '/login') {
            res.send(
                {
                    type: -1,
                    data: '',
                    msg: '未登录'
                }
            )
            return
        }
        next()
    })

    app.post('/login', (req, res) => {
        handler(
            {mysql, req, res},
            (data, done) => {
                const sql = `select * from t_user_admin where user_id = "${data.userId}" and password = "${data.password}"`
                mysql.query(sql, res => {
                    if (res.length) {
                        req.session.regenerate(err => {
                            if (err) {
                                return done('', 1, '登录失败')
                            }
                            req.session.user_id = data.userId
                            done('', 0, '登录成功')
                        })
                    } else {
                        done('', 1, '用户ID或密码错误')
                    }
                })
            }
        )
    })

    app.post('/logout', (req, res) => {
        handler(
            {mysql, req, res},
            (data, done) => {
                req.session.destroy()
                done('', 0, '退出登录')
            }
        )
    })
}

module.exports = auth
