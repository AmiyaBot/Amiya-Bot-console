import axios from 'axios'
import CommonMessage from '@/lib/message'
import {Loading} from 'element-ui'

export default class Requests {
    constructor (config) {
        this.host = config.host
        this.message = new CommonMessage()
    }

    httpRequests (method, options) {
        try {
            const url = options.url
            const data = options.data || {}
            const successMessage = options.successMessage === undefined ? false : options.successMessage
            const success = options.success
            const error = options.error
            const complete = options.complete

            const post = ['PUT', 'POST', 'PATCH'].indexOf(method.toUpperCase()) >= 0

            const params = post ? 'data' : 'params'
            const payload = post ? JSON.stringify(data) : data

            const config = {
                url: 'http://' + this.host + url,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                [params]: payload
            }

            const loading = Loading.service({
                lock: true,
                text: '请求中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.3)'
            })

            axios(config)
                .then(
                    response => {
                        const data = response.data
                        const status = response.status

                        if (status === 200) {
                            const msg = data.msg

                            if (successMessage && msg) {
                                successMessage && this.message.toast(msg, data.type === 0 ? this.message.success : this.message.warning)
                            }

                            success && success(data)
                        }
                    }
                )
                .catch(
                    err => {
                        this.message.notify(
                            err.toString(),
                            '请求发生错误',
                            this.message.error
                        )
                        error && error(err)
                    }
                )
                .finally(
                    () => {
                        loading.close()
                        complete && complete()
                    }
                )
        } catch (error) {
            throw error
        }
    }

    get (options) {
        this.httpRequests('get', options)
    }

    post (options) {
        this.httpRequests('post', options)
    }
}
