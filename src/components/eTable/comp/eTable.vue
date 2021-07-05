<template>
    <div class="listTable" :class="uid()">
        <searchFormBuilder :search-form="searchForm"
                           :search-form-display="searchFormDisplay"
                           :search-on="searchOn"
                           ref="searchForm">
        </searchFormBuilder>
        <div class="topArea" v-show="operationMode">
            <div class="tableOperation left">
                <slot name="top"></slot>
                <el-button type="primary" @click="searchList">查询</el-button>
                <el-button @click="cleanForm">重置查询</el-button>
            </div>
            <div class="tableOperation right">
                <el-popover popper-class="operations" trigger="click" title="批量操作">
                    <div class="operations" v-if="$scopedSlots.operations">
                        <slot name="operations" :items="selectedItems"></slot>
                    </div>
                    <div v-else>无</div>
                    <div class="tableButton operations" slot="reference"></div>
                </el-popover>
                <el-popover popper-class="list" trigger="click" title="表头筛选">
                    <el-form class="block">
                        <el-checkbox-group v-model="display">
                            <el-checkbox v-for="item in fields"
                                         :label="item.title"
                                         :name="item.field"
                                         :key="item.field"
                                         checked>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form>
                    <div class="tableButton list" slot="reference"></div>
                </el-popover>
                <div class="tableButton refresh" @click="loadList"></div>
                <el-popover popper-class="search" trigger="click" title="搜索项筛选">
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
                <div class="tableButton hide" :class="{ onHide: !searchOn }" @click="searchOn = !searchOn"></div>
                <div class="tableButton report"></div>
                <el-popover popper-class="export" trigger="click" title="导出表单" v-if="exportPageUrl || exportAllUrl">
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
        <el-table ref="table" border lazy v-loading="loading"
                  :data="data"
                  :max-height="maxHeight"
                  :row-key="dataId"
                  :load="loadChildren"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  :default-expand-all="expandAll"
                  @selection-change="selectionChange">

            <el-table-column fixed="left" type="selection" class-name="mark_selection"
                             v-if="selection"></el-table-column>

            <el-table-column v-for="(item, index) in fields" v-if="display.indexOf(item.title) >= 0"
                             :class-name="'mark_' + item.field"
                             :width="colWidth[item.field]"
                             :label="item.title"
                             :sortable="sortable"
                             :key="index">

                <template slot-scope="scope">
                    <slot name="custom"
                          :field="item"
                          :item="scope.row"
                          :value="scope.row[item.field]"
                          v-if="item.custom"></slot>
                    <span v-else>{{ scope.row[item.field] }}</span>
                </template>

            </el-table-column>

            <el-table-column fixed="right" label="操作" class-name="mark_operation" v-if="$scopedSlots.row"
                             :width="colWidth['operation']">
                <template slot-scope="scope">
                    <slot name="row" :item="scope.row"></slot>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="page" layout="total, prev, pager, next, sizes, jumper"
                       background
                       v-if="pagination"
                       :hide-on-single-page="false"
                       :total="totalPage"
                       :page-size="pageSize"
                       :current-page="currPage"
                       @current-change="pageChange"
                       @size-change="pageSizeChange">
        </el-pagination>
    </div>
</template>

<script>
import searchFormBuilder from '@/components/eTable/comp/searchFormBuilder'
import exportContent from '@/components/eTable/comp/exportContent'
import eTableProps from '@/components/eTable/js/eTableProps'
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
        }
    },
    watch: {
        tableChange: {
            handler: function () {
                this.resetWidth()
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
                    titles.push(item.title)
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
            return this.$refs.searchForm.$refs.form.formData
        },
        setOptions: function (field, data) {
            this.$refs.searchForm.$refs.form.setOptions(field, data)
        },
        searchList: function () {
            this.currPage = 1
            this.loadList()
        },
        loadList: function () {
            const search = this.getValue()
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
        resetWidth: function () {
            if (!this.autoReset) {
                return
            }
            this.loading = true
            this.$nextTick(() => {
                this.$set(this, 'colWidth', calcMinWidth(this.$refs.table.$el))
                this.$nextTick(() => {
                    this.loading = false
                })
            })
        },
        pageChange: function (page) {
            this.currPage = page
            this.loadList()
        },
        pageSizeChange: function (size) {
            this.currPageSize = size
            this.loadList()
        },
        selectionChange: function (items) {
            this.$set(this, 'selectedItems', items)
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
            this.loadList()
        }
    },
    data () {
        return {
            display: [],
            colWidth: {},
            selectedItems: [],
            searchForm: [],
            searchFormDisplay: [],
            searchOn: null,
            currPage: 1,
            currPageSize: 0,
            loading: false
        }
    },
    mounted () {
        this.currPageSize = this.pageSize
        this.initSearchForm()
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
