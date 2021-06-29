export default {
    size: {
        type: String,
        default: 'medium'
    },
    inline: {
        type: Boolean,
        default: false
    },
    labelWidth: {
        type: String,
        default: '150px'
    },
    buildData: {
        type: Array,
        default: () => []
    },
    displayFilter: {
        type: Array,
        default: () => []
    },
    displayAll: {
        type: Boolean,
        default: true
    },
    beforeSubmit: {
        type: Function,
        default: () => null
    }
}
