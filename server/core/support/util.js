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

function SqlBuilder () {
    this.where = (data, type = 'equal') => {
        const where = []
        for (let name in data) {
            const value = data[name]
            if (value) {
                const condition = type === 'like' ? `like "%${value}%"` : `= "${value}"`
                where.push(
                    `${where.length === 0 ? 'where' : 'and'} ${name} ${condition}`
                )
            }
        }
        return where.length ? where.join(' ') : ''
    }
    this.pages = (page, pageSize) => {
        return [
            (page - 1) * pageSize,
            pageSize
        ]
    }
    this.queryPages = (table, search = {}, page = 1, pageSize = 10, condition = '') => {
        const where = this.where(search, 'like')
        const list = `select * from ${table} ${where} ${condition} limit ${this.pages(page, pageSize)}`
        const count = `select count(*) as total from ${table} ${where}`
        return {
            data: list,
            count: count
        }
    }
    this.insert = (table, data) => {
        return `insert into ${table} (${Object.keys(data).join(', ')}) values ("${Object.values(data).join('", "')}")`
    }
    this.update = (table, data, condition) => {
        const set = []
        for (let field in data) {
            set.push(`${field} = "${data[field]}"`)
        }
        return `update ${table} set ${set.join(', ')} ${this.where(condition)}`
    }
    this.delete = (table, condition) => {
        return `delete from ${table} ${this.where(condition)}`
    }
}

module.exports = {
    util: new Util(),
    sqlBuilder: new SqlBuilder()
}
