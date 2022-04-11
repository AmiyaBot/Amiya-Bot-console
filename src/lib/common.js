export default class Common {
    saveData (name, data) {
        let dataStr = null
        if (typeof data === 'object') {
            dataStr = JSON.stringify(data)
        }
        if (typeof data === 'string' || typeof data === 'number') {
            dataStr = data.toString()
        }
        if (dataStr) {
            localStorage.setItem(name, dataStr)
        }
    }

    getData (name) {
        let data = localStorage.getItem(name)
        if (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
            }
            return data
        }
    }

    removeData (name) {
        localStorage.removeItem(name)
    }

    deepCopy (data) {
        return JSON.parse(JSON.stringify(data))
    }

    formatDate (time, format = 'y-m-d h:i:s') {
        if (time) {
            const mSec = time * (time.toString().length < 13 ? 1000 : 1)
            const date = new Date(mSec)
            const zero = num => parseInt(num) < 10 ? '0' + num : num
            const contrast = {
                y: date.getFullYear(),
                m: zero(date.getMonth() + 1),
                d: zero(date.getDate()),
                h: zero(date.getHours()),
                i: zero(date.getMinutes()),
                s: zero(date.getSeconds())
            }

            for (let n in contrast) {
                format = format.replace(new RegExp(n, 'g'), contrast[n])
            }

            return format
        } else {
            return time
        }
    }
}
