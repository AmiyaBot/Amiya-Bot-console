<template>
    <div class="table-selector">
        <el-popover placement="bottom"
                    trigger="manual"
                    v-model="visible">

            <div slot="reference">
                <slot :show="show" :input="onInput"></slot>
            </div>
            <div class="search-table listTable" :class="uid()" :style="{ minWidth: minWidth + 'px' }">
                <el-table ref="table"
                          :data="dataList"
                          :row-class-name="hoverRow"
                          max-height="303px"
                          border
                          highlight-current-row
                          @current-change="selectedRow">
                    <el-table-column v-for="(item, index) in tableField"
                                     :class-name="'mark_' + item.field"
                                     :width="(colWidth[item.field] || 0) + 'px'"
                                     :prop="item.field"
                                     :label="item.title"
                                     :key="index"></el-table-column>
                </el-table>
            </div>
        </el-popover>
    </div>
</template>

<script>
import tableSelectorProps from '@/components/eForm/js/tableSelectorProps'
import {calcMinWidth} from '@/components/eTable/js/builtin'
import $ from 'jquery'

export default {
    name: 'tableSelector',
    props: tableSelectorProps,
    watch: {
        inputValue: function (value) {
            if (value) {
                this.doSearch(value)
            } else {
                this.$set(this, 'dataList', [])
                this.$emit('inputEmpty')
            }
        },
        status: {
            handler: function (status) {
                this.visible = status.onFocus || status.onHover
            },
            deep: true
        },
        tableData: {
            handler: function () {
                this.loadData()
            },
            deep: true
        },
        dataList: {
            handler: function (data) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$set(this, 'colWidth', calcMinWidth(this.$refs.table.$el, 100))
                    }, 500)
                    this.$emit('dataChange', data)
                })
            },
            deep: true
        },
        visible: function (status) {
            if (status) {
                this.doSearch(this.inputValue || undefined)

                $(`.search-table.${this.uid()}`).off('mouseenter mouseleave').on({
                    mouseenter: () => this.status.onHover = true,
                    mouseleave: () => this.status.onHover = false
                })
            } else {
                $(`.search-table.${this.uid()}`).off('mouseenter mouseleave')
            }
        },
        currIndex: function (value) {
            const height = $(`.search-table.${this.uid()} .curr`).height()
            const scroll = (value - 6) * height

            $(`.search-table.${this.uid()} .el-table__body-wrapper`).scrollTop(scroll)
        }
    },
    methods: {
        uid: function () {
            return 'tableSelector' + this['_uid']
        },
        onInput: function () {
            this.setVirtual(this.field, '')
        },
        doSearch: function (value) {
            if (this.search) {
                this.search(value, data => {
                    this.$set(this, 'dataList', data)
                })
            }
        },
        show: function (status = true, $event) {
            this.minWidth = $event.target.clientWidth
            this.status.onFocus = status
            if (status) {
                this.currIndex = 0
                $($event.target).off('keydown').on({
                    keydown: e => {
                        switch (e.keyCode) {
                            case 13:
                                if (this.dataList.length) {
                                    this.selectedRow(this.dataList[this.currIndex])
                                    this.status.onFocus = false

                                    $event.target.blur()
                                }
                                break
                            case 38:
                                this.currIndex = this.currIndex - 1 > -1 ? this.currIndex - 1 : 0
                                break
                            case 40:
                                this.currIndex = this.currIndex + 1 < this.dataList.length ? this.currIndex + 1 : this.dataList.length - 1
                                break
                        }
                    }
                })
            }
        },
        hoverRow: function (row) {
            return row.rowIndex === this.currIndex ? 'curr' : ''
        },
        selectedRow: function (item) {
            if (item) {
                let value, show
                if (this.field in item) {
                    value = item[this.virtual && 'value' in this.virtual ? this.virtual.value : this.field]
                    show = item[this.virtual && 'show' in this.virtual ? this.virtual.show : this.field]
                } else if (this.virtual && ('value' in this.virtual || 'show' in this.virtual)) {
                    value = 'value' in this.virtual ? item[this.virtual.value] : ''
                    show = 'show' in this.virtual ? item[this.virtual.show] : ''
                }

                this.bind[this.field] = show || value
                this.setVirtual(this.field, value)

                if (this.selected) {
                    this.selected(JSON.parse(JSON.stringify(item)))
                }
            }
            this.status.onHover = false
        },
        loadData: function () {
            if (this.tableData) {
                this.$set(this, 'dataList', this.tableData || [])
            }
        }
    },
    data () {
        return {
            visible: false,
            status: {
                onFocus: false,
                onHover: false
            },
            dataList: [],
            colWidth: {},
            minWidth: 0,
            currIndex: 0
        }
    },
    mounted () {
        this.loadData()
    }
}
</script>

<style src="../css/eForm-table-modify.css"></style>
<style>
.curr > td {
    background-color: rgba(95, 73, 230, 0.1) !important;
}
</style>
