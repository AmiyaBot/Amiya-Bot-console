export default {
    bind: Object,
    field: String,
    virtual: Object,
    setVirtual: Function,
    tree: {
        type: Object,
        default: () => {
            return {}
        }
    },
    treeData: {
        type: Array,
        default: () => {
            return []
        }
    },
    selected: {
        type: Function,
        default: () => {
        }
    }
}
