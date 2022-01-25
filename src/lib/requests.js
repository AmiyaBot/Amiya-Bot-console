import axios from 'axios'
import Common from '@/lib/common'
import CommonMessage from '@/lib/message'
import {Loading} from 'element-ui'

window.axiosRequestsList = []

axios.defaults.withCredentials = false

export default class Requests {
    constructor (config) {
        this.host = config.host
        this.common = new Common()
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
            const payload = post && options.json ? JSON.stringify(data) : data
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers || {}
            }

            const token = this.common.getData('token')
            if (token) {
                headers.Authorization = 'Bearer ' + token
            }

            const config = {
                url: 'http://' + this.host + url,
                method: method,
                headers: headers,
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
                        this.handleResponse(response, successMessage, success, error)
                    }
                )
                .catch(
                    err => {
                        if (err.response) {
                            this.handleResponse(err.response, successMessage, success, error)
                            return
                        }
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

    upload (url, file, filename, callback) {
        const form = new FormData()
        const options = {
            url: url,
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

    handleResponse (response, successMessage, success, error) {
        const data = response.data
        const status = response.status

        switch (status) {
            case 200:
                let code = data.code
                let message = data.message

                if ('access_token' in data) {
                    this.common.saveData('token', data['access_token'])
                    code = 200
                    message = '登录成功'
                }

                switch (code) {
                    case 200:
                        if (successMessage && message) {
                            successMessage && this.message.notify(message, '提示', this.message.success)
                        }
                        success && success(data.data)
                        break
                    case 0:
                        this.message.notify(message, '提示', this.message.warning)
                        error && error()
                        break
                }
                break
            case 401:
                if (location.hash === '#/') {
                    this.message.notify(response.data.detail, '拒绝登录', this.message.warning)
                } else {
                    this.message.alert(response.data.detail, '登录失效', () => {
                        location.href = '/'
                    }, this.message.warning)
                }
                break
            default:
                this.message.notify(response.statusText, '请求异常', this.message.error)
        }
    }
}
