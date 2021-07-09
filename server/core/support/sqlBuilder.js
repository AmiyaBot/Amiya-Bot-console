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

module.exports = new SqlBuilder()
