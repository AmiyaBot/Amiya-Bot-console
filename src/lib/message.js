import {Message, MessageBox, Notification} from 'element-ui'

export default class CommonMessage {
    constructor () {
        this.info = 'info'
        this.error = 'error'
        this.success = 'success'
        this.warning = 'warning'
    }

    toast (text,
        type = this.success) {
        Message(
            {
                type: type,
                message: text
            }
        )
    }

    notify (text,
        title = '提示',
        type = this.info,
        duration = 5000) {
        Notification(
            {
                type: type,
                title: title,
                message: text,
                duration: duration
            }
        )
    }

    alert (text,
        title = '提示',
        callback,
        type = this.info) {
        MessageBox
            .alert(text, title,
                {
                    type: type,
                    confirmButtonText: '好的',
                    callback: callback
                }
            )
            .then(null)
    }

    confirm (text,
        title = '提示',
        confirm,
        cancel,
        type = this.warning) {
        MessageBox
            .confirm(text, title,
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: type
                }
            )
            .then(confirm || null)
            .catch(cancel || null)
    }

    prompt (text,
        title = '提示',
        done) {
        const confirm = (data) => {
            done && done(data.value)
        }

        MessageBox
            .prompt(text, title,
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }
            )
            .then(confirm)
    }
}
