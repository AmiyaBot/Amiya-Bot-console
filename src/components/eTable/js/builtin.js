/**
 * 计算列最小宽度
 */
export function calcMinWidth (table, cellMinWidth = 50) {
    let maxWidth = table.clientWidth
    let widthList = {}
    let total = 0

    if (maxWidth === 0) {
        return {}
    }

    let tr = table.querySelectorAll('tr')

    tr.forEach(td => {
        td.querySelectorAll('td, th').forEach((item, index) => {
            let cell = item.querySelector('.cell')
            let cellItems = item.querySelectorAll('.cell > *')
            let name = item.className.match(/mark_(\S+)/)
            let width = cellMinWidth

            for (let el of cellItems) {
                width += el.offsetWidth
            }

            if (name) {
                name = name[1]

                if (name === 'operation') {
                    width += 30
                }

                if (name in widthList) {
                    if (widthList[name] < width) {
                        widthList[name] = width
                    }
                } else {
                    widthList[name] = cell.offsetWidth
                }
            }
        })
    })

    // 计算总宽度
    for (let i in widthList) {
        total += widthList[i]
    }

    if (total < maxWidth) {
        let length = Object.keys(widthList).length

        if ('selection' in widthList) {
            length -= 1
        }
        if ('operation' in widthList) {
            length -= 1
        }

        const empty = (maxWidth - total) / length
        for (let i in widthList) {
            if (i === 'selection' || i === 'operation') {
                continue
            }
            widthList[i] += empty
        }
    }

    return widthList
}
