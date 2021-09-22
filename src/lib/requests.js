import axios from 'axios'
import CommonMessage from '@/lib/message'
import {Loading} from 'element-ui'

window.axiosRequestsList = []

axios.defaults.withCredentials = true

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
            const headers = options.headers

            const post = ['PUT', 'POST', 'PATCH'].indexOf(method.toUpperCase()) >= 0

            const params = post ? 'data' : 'params'
            const payload = post && options.json ? JSON.stringify(data) : data

            const config = {
                url: 'http://' + this.host + url,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                cancelToken: new axios.CancelToken(cancel => {
                    window.axiosRequestsList.push({cancel})
                }),
                [params]: payload
            }

            for (let name in headers) {
                config.headers[name] = headers[name]
            }

            const loading = Loading.service({
                lock: true,
                text: '正在请求服务器...',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.3)'
            })

            axios(config)
                .then(
                    response => {
                        const data = response.data
                        const status = response.status

                        if (status === 200) {
                            const code = data.code
                            const message = data.message
                            switch (code) {
                                case 200:
                                    if (successMessage && message) {
                                        successMessage && this.message.notify(message, '提示', this.message.success)
                                    }
                                    success && success(data.data)
                                    break
                                case 300:
                                    this.message.notify(message, '提示', this.message.success)
                                    break
                                case 400:
                                    this.message.alert(message, 'Access 错误', () => {
                                        location.href = '/'
                                    })
                                    break
                                case 0:
                                    this.message.notify(message, '提示', this.message.warning)
                                    error && error()
                                    break
                            }
                        }
                    }
                )
                .catch(
                    err => {
                        this.message.notify(err.toString(), '请求发生错误', this.message.error)
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

    upload (file, filename, callback) {
        const form = new FormData()
        const options = {
            url: '/upload',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            json: false,
            successMessage: true,
            success: callback
        }

        form.append('file', file)
        form.append('filename', filename)
        options.data = form

        this.httpRequests('post', options)
    }
}
