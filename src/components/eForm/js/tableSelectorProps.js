export default {
    tableData: Array,
    tableField: Array,
    search: Function,
    inputValue: String | Number,
    bind: Object,
    field: String,
    virtual: Object,
    setVirtual: Function,
    selected: {
        type: Function,
        default: () => {
        }
    }
}
