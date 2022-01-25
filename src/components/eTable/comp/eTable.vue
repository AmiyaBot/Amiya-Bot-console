<template>
    <div class="listTable" ref="listTable" :class="uid()">
        <searchFormBuilder v-if="searchMode"
                           :search-form="searchForm"
                           :search-form-display="searchFormDisplay"
                           :search-on="searchOn"
                           @height="height => this.calcTableHeight(height)"
                           @search="loadList(true)"
                           ref="searchForm">
        </searchFormBuilder>
        <div class="topArea" v-show="operationMode">
            <div class="tableOperation left">
                <slot name="top"></slot>
                <template v-if="searchFormDisplay.length && searchMode">
                    <el-button type="primary" @click="loadList(true)">查询</el-button>
                    <el-button type="info" @click="cleanForm">重置查询</el-button>
                </template>
            </div>
            <div class="tableOperation right">
                <el-popover popper-class="operations" trigger="click" :title="`批量操作(${allSelection.length})`">
                    <div class="operations" v-if="$scopedSlots.operations">
                        <slot name="operations" :items="allSelection"></slot>
                    </div>
                    <div v-else>无</div>
                    <div class="tableButton operations" slot="reference"></div>
                </el-popover>
                <el-popover popper-class="list" trigger="click" title="表头筛选">
                    <el-form class="block">
                        <el-checkbox-group v-model="display">
                            <el-checkbox v-for="item in fields" v-if="item.show !== false"
                                         :label="item.title"
                                         :name="item.field"
                                         :key="item.field"
                                         checked>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form>
                    <div class="tableButton list" slot="reference"></div>
                </el-popover>
                <div class="tableButton refresh" @click="loadList(true)"></div>
                <el-popover popper-class="search" trigger="click" title="搜索项筛选" v-if="searchMode">
                    <el-form class="block">
                        <el-checkbox-group v-model="searchFormDisplay">
                            <el-checkbox v-for="(item, index) in searchForm"
                                         :label="item.title"
                                         :name="item.field"
                                         :key="index"></el-checkbox>
                        </el-checkbox-group>
                    </el-form>
                    <div class="tableButton search" slot="reference"></div>
                </el-popover>
                <div class="tableButton hide" v-if="searchMode"
                     :class="{ onHide: !searchOn }"
                     @click="searchOn = !searchOn"></div>
                <el-popover popper-class="export" trigger="click" title="导出表单"
                            v-if="exportPageUrl || exportAllUrl || $scopedSlots.exportButton">
                    <div class="exportButtonCon" v-if="$scopedSlots.exportButton">
                        <slot name="exportButton" :items="allSelection"></slot>
                    </div>
                    <exportContent :export-page-url="exportPageUrl"
                                   :export-all-url="exportAllUrl"
                                   :curr-page="currPage"
                                   :curr-page-size="currPageSize"
                                   :get-value="getValue">
                    </exportContent>
                    <div class="tableButton export" slot="reference"></div>
                </el-popover>
            </div>
        </div>
        <slot name="tableContent">
            <el-table ref="table" border lazy v-loading="loading"
                      :data="data"
                      :max-height="tableHeight"
                      :row-key="dataId"
                      :load="loadChildren"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :default-expand-all="expandAll"
                      :row-class-name="rowClassName"
                      :row-style="rowStyle"
                      @row-click="rowClick"
                      @sort-change="sortableHandler"
                      @selection-change="selectionChange">

                <el-table-column fixed="left" type="selection" class-name="mark_selection"
                                 v-if="selection"></el-table-column>

                <el-table-column type="expand" v-if="$scopedSlots.expand">
                    <template slot-scope="props">
                        <slot name="expand" :item="props.row"></slot>
                    </template>
                </el-table-column>

                <el-table-column v-for="(item, index) in fields"
                                 v-if="display.indexOf(item.title) >= 0 && item.show !== false"
                                 :class-name="'mark_' + item.field"
                                 :width="widths[item.field] || colWidth[item.field]"
                                 :label="item.title"
                                 :prop="item.field"
                                 :sortable="!!item.sortable ? 'custom' : false"
                                 :key="index">

                    <template slot-scope="scope">
                        <template v-if="item.custom">
                            <slot v-if="typeof item.custom !== 'function'" name="custom"
                                  :field="item"
                                  :item="scope.row"
                                  :index="scope.$index"
                                  :value="scope.row[item.field]"></slot>
                            <span v-else>{{ item.custom(scope.row[item.field]) }}</span>
                        </template>
                        <span v-else>{{ scope.row[item.field] }}</span>
                    </template>

                </el-table-column>

                <el-table-column fixed="right" label="操作" class-name="mark_operation" v-if="$scopedSlots.row"
                                 :width="widths['operation'] || colWidth['operation']">
                    <template slot-scope="scope">
                        <slot name="row" :item="scope.row" :index="scope.$index"></slot>
                    </template>
                </el-table-column>
            </el-table>
        </slot>
        <div class="footer">
            <el-pagination class="page" layout="total, prev, pager, next, sizes, jumper" v-if="pagination"
                           background
                           :hide-on-single-page="false"
                           :total="totalPage"
                           :page-size="pageSize"
                           :current-page="currPage"
                           @current-change="pageChange"
                           @size-change="pageSizeChange">
            </el-pagination>
            <div class="selectedSum" v-if="allSelection.length">
                <span style="margin-right: 10px">已选 {{ allSelection.length }} 条</span>
                <el-button type="text" @click="resetSelection">清空已选</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import searchFormBuilder from './searchFormBuilder'
import exportContent from './exportContent'
import eTableProps from '../js/eTableProps'
import $ from 'jquery'

import {calcMinWidth} from '../js/builtin'

export default {
    name: 'eTable',
    props: eTableProps,
    components: {
        searchFormBuilder,
        exportContent
    },
    computed: {
        tableChange: function () {
            const {data, display} = this
            return {data, display}
        },
        allSelection: function () {
            const selected = []
            for (let page in this.selectedItems) {
                for (let item of this.selectedItems[page]) {
                    selected.push(this.lib.common.shallowCopy(item))
                }
            }
            return selected
        }
    },
    watch: {
        tableChange: {
            handler: function () {
                this.resetWidth()
            },
            deep: true
        },
        data: {
            handler: function () {
                this.$nextTick(() => {
                    const selected = this.selectedIndex[this.currPage]
                    if (selected && selected.length) {
                        for (let index of selected) {
                            this.$refs.table.toggleRowSelection(this.data[index])
                        }
                    }
                })
            },
            deep: true
        }
    },
    methods: {
        uid: function () {
            return 'table' + this['_uid']
        },
        rebuild: function () {
            this.$nextTick(() => {
                const titles = []
                const display = []

                for (let item of this.fields) {
                    if (item.show !== false) {
                        titles.push(item.title)
                    }
                }
                for (let item of this.display) {
                    if (titles.indexOf(item) >= 0) {
                        display.push(item)
                    }
                }

                this.$set(this, 'display', display)
                this.initSearchForm()
            })
        },
        getValue: function () {
            if ('searchForm' in this.$refs) {
                return this.$refs.searchForm.$refs.form.formData
            }
            return {}
        },
        setOptions: function (field, data) {
            if (field.constructor === Object) {
                for (let name in field) {
                    this.$refs.searchForm.$refs.form.setOptions(name, field[name])
                }
            } else {
                this.$refs.searchForm.$refs.form.setOptions(field, data)
            }
        },
        loadList: function (reset = false) {
            const search = this.getValue()

            if (this.sort && this.sort.order) {
                search[this.remoteSortColumnField] = this.sort.field
                search[this.remoteSortOrderField] = this.sort.order === 'ascending' ? 'asc' : 'desc'
            }

            if (reset) {
                this.currPage = 1
            }
            this.listLoader(
                this.currPage,
                this.currPageSize,
                JSON.parse(JSON.stringify(search))
            )
        },
        loadChildren: function (item, node, resolve) {
            this.expandLoader(item, data => {
                resolve(data)
                this.resetWidth()
            })
        },
        calcTableHeight: function (searchHeight, times = 1) {
            if (this.autoCalcHeight) {
                let height = this.$refs.listTable.clientHeight
                let offset = height - searchHeight - (this.operationMode ? 92 : 0)
                if (offset > 100) {
                    this.tableHeight = offset
                } else if (times <= 3) {
                    this.$nextTick(() => this.calcTableHeight(searchHeight, ++times))
                } else {
                    this.tableHeight = this.maxHeight
                }
            } else {
                this.tableHeight = this.maxHeight
            }
        },
        resetWidth: function () {
            if (!this.autoReset) {
                return
            }
            setTimeout(() => {
                this.$set(this, 'colWidth', calcMinWidth(this.$refs.table.$el))
            }, 500)
        },
        pageChange: function (page) {
            this.currPage = page
            this.pageChangeStatus = 1
            this.loadList()
        },
        pageSizeChange: function (size) {
            this.currPageSize = size
            this.loadList()
        },
        selectionChange: function (items) {
            let indexes = []
            let selected = []

            if (this.pageChangeStatus && this.currPage in this.selectedIndex) {
                indexes = this.selectedIndex[this.currPage]
                selected = this.selectedItems[this.currPage]
                this.pageChangeStatus = 0
            }

            for (let item of items) {
                for (let index in this.data) {
                    if (indexes.indexOf(index) >= 0) {
                        continue
                    }

                    const eq = escape(JSON.stringify(item)) === escape(JSON.stringify(this.data[index]))

                    if (eq) {
                        indexes.push(index)
                        selected.push(this.data[index])
                    }
                }
            }
            this.$set(this.selectedIndex, this.currPage, indexes)
            this.$set(this.selectedItems, this.currPage, selected)
        },
        resetSelection: function () {
            this.$refs.table.clearSelection()
            this.$set(this, 'selectedIndex', {})
            this.$set(this, 'selectedItems', {})
        },
        initSearchForm: function () {
            let searchForm = []
            let searchFormDisplay = []

            for (let item of this.fields) {
                const config = item.search
                const formItem = {
                    title: item.title,
                    field: item.field
                }

                if (config !== false) {
                    formItem.config = config || {
                        type: 1
                    }
                    if (config && !config['type']) {
                        formItem.config.type = 1
                    }
                    if (config && 'checked' in config && config['checked']) {
                        searchFormDisplay.push(item.title)
                    }
                    searchForm.push(formItem)
                }
            }
            this.$set(this, 'searchForm', searchForm)
            this.$set(this, 'searchFormDisplay', searchFormDisplay)
            this.searchOn = true
        },
        cleanForm: function () {
            this.$refs.searchForm.cleanForm()
            this.loadList(true)
        },
        sortableHandler: function (sort) {
            const field = sort.prop
            const order = sort.order

            this.$set(this, 'sort', {field, order})
            this.loadList()
        },
        jumpByIndex: function (index) {
            const tr = $('.' + this.uid() + ' .el-table__body-wrapper .el-table__row')[index]
            if (tr) {
                $('.' + this.uid() + ' .el-table__body-wrapper').animate(
                    {
                        scrollTop: tr.offsetTop + 'px'
                    },
                    {
                        speed: 500
                    }
                )
            }
        }
    },
    data () {
        return {
            display: [],
            colWidth: {},
            selectedItems: {},
            selectedIndex: {},
            sort: {},
            searchForm: [],
            searchFormDisplay: [],
            searchOn: null,
            currPage: 1,
            currPageSize: 0,
            pageChangeStatus: 0,
            tableHeight: 0,
            loading: false
        }
    },
    mounted () {
        this.currPageSize = this.pageSize
        this.initSearchForm()

        this.$nextTick(() => {
            if (!this.searchMode) {
                this.calcTableHeight(0)
            }
        })
    },
    updated () {
        $('.' + this.uid() + ' .el-table__expand-icon')
            .off('click')
            .click(this.resetWidth)
    }
}
</script>

<style src="../css/eTable.css" scoped></style>
<style src="../css/eTable-global.css"></style>
<style src="../css/eTable-modify.css"></style>
