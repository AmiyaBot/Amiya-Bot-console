/**
 * 计算列最小宽度
 */
export function calcMinWidth (table, cellMinWidth = 100) {
    let tr = table.querySelectorAll('tr')
    let widthList = {}

    tr.forEach(td => {
        td.querySelectorAll('td, th').forEach((item, index) => {
            let cell = item.querySelectorAll('.cell > *')
            let name = item.className.match(/mark_(\S+)/)
            let width = cellMinWidth

            for (let el of cell) {
                width += el.offsetWidth
            }

            if (name) {
                name = name[1]

                if (!(name in widthList) || widthList[name] < width) {
                    widthList[name] = width
                }
            }
        })
    })

    let total = 0
    let maxWidth = table.clientWidth

    // 计算总宽度
    for (let i in widthList) {
        total += widthList[i]
    }

    // 如果总宽度不够，则只保留操作按钮那一列的宽度，其余自动计算
    if (total < maxWidth) {
        if ('operation' in widthList) {
            return {
                operation: widthList.operation
            }
        }
        return {}
    }

    return widthList
}
