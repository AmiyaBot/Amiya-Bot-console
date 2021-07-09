function Util () {
    this.lastTime = (hour = 24) => {
        const last = parseInt(
            (new Date().getTime() / 1000 - hour * 3600).toFixed(0)
        )
        const lastTime = this.formatDate(last, 'y-m-d h:00:00')
        return parseInt(
            (new Date(lastTime).getTime() / 1000).toFixed(0)
        )
    }
    this.formatDate = (time = new Date().getTime(), format = 'y-m-d h:i:s') => {
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

module.exports = new Util()
