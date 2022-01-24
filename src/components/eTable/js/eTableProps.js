export default {
    fields: Array,
    dataId: String,
    totalPage: Number,
    exportPageUrl: String,
    exportAllUrl: String,
    remoteSortColumnField: {
        type: String,
        default: 'orderByColumn'
    },
    remoteSortOrderField: {
        type: String,
        default: 'isAsc'
    },
    data: {
        type: Array,
        default: () => []
    },
    operationMode: {
        type: Boolean,
        default: true
    },
    searchMode: {
        type: Boolean,
        default: true
    },
    selection: {
        type: Boolean,
        default: true
    },
    pageSize: {
        type: Number,
        default: 10
    },
    maxHeight: {
        type: Number,
        default: 600
    },
    widths: {
        type: Object,
        default: () => {
            return {}
        }
    },
    expandAll: {
        type: Boolean,
        default: false
    },
    autoReset: {
        type: Boolean,
        default: true
    },
    autoCalcHeight: {
        type: Boolean,
        default: true
    },
    pagination: {
        type: Boolean,
        default: true
    },
    listLoader: {
        type: Function,
        default: () => null
    },
    expandLoader: {
        type: Function,
        default: () => null
    },
    rowClick: {
        type: Function,
        default: (row, col, event) => null
    },
    rowClassName: {
        type: Function,
        default: ({row, rowIndex}) => null
    },
    rowStyle: {
        type: Function,
        default: ({row, rowIndex}) => null
    }
}
