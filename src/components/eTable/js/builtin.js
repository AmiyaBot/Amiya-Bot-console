/**
 * 计算列最小宽度
 */
export function calcMinWidth (table) {
    let tr = table.querySelectorAll('tr')
    let widthList = {}
    let calcList = {}
    tr.forEach(td => {
        td.querySelectorAll('td, th').forEach((item, index) => {
            let cell = item.querySelector('.cell')
            if (cell) {
                let name = item.className.match(/mark_(\S+)/)[1]
                let width = cell.clientWidth <= 400 ? cell.clientWidth : 400
                if (!(name in widthList) || widthList[name] < width) {
                    widthList[name] = width
                }
                if (!(index in calcList) || calcList[index] < width) {
                    calcList[index] = width
                }
            }
        })
    })

    let total = 0
    let maxWidth = table.clientWidth

    // 计算总宽度
    for (let i in calcList) {
        total += calcList[i]
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
