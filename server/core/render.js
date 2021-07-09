const fs = require('fs')
const path = require('path')
const handler = require('./support/handler')

function initIndexes () {
    const files = fs.readdirSync(path.resolve(__dirname, './interfaces'))
    const interfaces = []

    for (let file of files) {
        const _controller = require('./interfaces/' + file)
        const _name = file.split('.')[0]

        for (let item of Object.keys(new _controller())) {
            interfaces.push(
                {
                    path: [_name, item].join('/'),
                    controllerName: _name,
                    functionName: item,
                    controller: _controller
                }
            )
        }
    }
    return interfaces
}

module.exports = (app, mysql) => {
    const interfaces = initIndexes()
    const controllers = {}

    for (let item of interfaces) {
        const Controller = item.controller
        const hasInit = item.controllerName in controllers

        if (!hasInit) {
            controllers[item.controllerName] = new Controller(mysql)
        }

        const target = controllers[item.controllerName]

        app.post('/' + item.path, (req, res) => {
            handler({mysql, req, res}, target[item.functionName])
        })
    }
}
