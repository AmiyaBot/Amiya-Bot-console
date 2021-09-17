export default {
    fields: Array,
    dataId: String,
    totalPage: Number,
    exportPageUrl: String,
    exportAllUrl: String,
    operationMode: {
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
    data: {
        type: Array,
        default: []
    },
    expandAll: {
        type: Boolean,
        default: false
    },
    autoReset: {
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
    }
}
