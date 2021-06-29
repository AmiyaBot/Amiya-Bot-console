<template>
    <div class="listTable sheetsTable">
        <el-tabs v-model="activeName" type="border-card">
            <template v-for="(content, sheet) in sheetsData">
                <el-tab-pane :label="sheet" :name="sheet" :key="sheet">

                    <el-table ref="table"
                              :data="getContent(content)"
                              :border="true"
                              @selection-change="selectionChange">
                        <el-table-column fixed="left" type="selection"></el-table-column>
                        <el-table-column v-for="(value, name) in content.length ? content[0] : {'Empty': ''}"
                                         min-width="180px"
                                         :key="name"
                                         :prop="name"
                                         :label="name">
                            <template slot="header" slot-scope="scope">
                                <div>{{ scope.column.label }}</div>
                                <div>
                                    <el-select v-model="titles[sheet][scope.column.label]"
                                               @change="checkRepeat(scope.column.label, $event)"
                                               filterable
                                               clearable
                                               placeholder="请选择字段"
                                               size="mini">
                                        <el-option v-for="(name, field) in fields"
                                                   :key="field"
                                                   :label="name"
                                                   :value="field">
                                            <span class="op-title" style="float: left">{{ name }}</span>
                                            <span class="op-checked"
                                                  v-if="field in onselect[sheet]">
                                                {{ onselect[sheet][field] }}
                                            </span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <span>{{ scope.row[name] ? scope.row[name].toString() : '' }}</span>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div style="margin-top: 10px">
                        <el-pagination class="page" layout="total, prev, pager, next, jumper"
                                       background
                                       :hide-on-single-page="false"
                                       :total="content.length"
                                       :current-page="page[sheet]"
                                       @current-change="pageChange">
                        </el-pagination>
                    </div>

                    <div class="button">
                        <el-button @click="upload(false)">上传选择项</el-button>
                        <el-button type="danger" @click="upload(true)">上传全部内容</el-button>
                    </div>

                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'sheetsTable',
    props: {
        fields: Object,
        sheetsData: Object,
        onUpload: Function
    },
    watch: {
        sheetsData: {
            handler: function (data) {
                this.activeName = ''

                let sheetsList = Object.keys(data)
                let onselect = {}
                let checked = {}
                let titles = {}
                let page = {}

                if (sheetsList.length) {
                    this.activeName = sheetsList[0]
                    for (let name of sheetsList) {
                        onselect[name] = {}
                        checked[name] = []
                        titles[name] = {}
                        page[name] = 1

                        if (data[name].length) {
                            for (let item of Object.keys(data[name][0])) {
                                titles[name][item] = ''
                            }
                        }
                    }
                }

                this.$set(this, 'page', page)
                this.$set(this, 'titles', titles)
                this.$set(this, 'checked', checked)
                this.$set(this, 'onselect', onselect)
            },
            deep: true
        },
        titles: {
            handler: function (data) {
                const target = data[this.activeName]
                const selectList = {}

                for (let name in target) {
                    if (target[name]) {
                        selectList[target[name]] = name
                    }
                }

                this.$set(this.onselect, this.activeName, selectList)
            },
            deep: true
        }
    },
    methods: {
        checkRepeat: function (label, value) {
            const target = this.titles[this.activeName]
            for (let name in target) {
                if (name !== label && target[name] === value) {
                    target[name] = ''
                }
            }
        },
        selectionChange: function (items) {
            this.$set(this.checked, this.activeName, items)
        },
        pageChange: function (page) {
            this.page[this.activeName] = page
            // this.$nextTick(() => {
            //     for (let item of this.checked[this.activeName]) {
            //         this.$refs.table.toggleRowSelection(item)
            //     }
            // })
        },
        getContent: function (content) {
            const page = this.page[this.activeName]
            const list = JSON.parse(
                JSON.stringify(content)
            )
            return list.splice((page - 1) * 10, 10)
        },
        upload: function (all = false) {
            const list = all ? this.sheetsData[this.activeName] : this.checked[this.activeName]

            if (list.length === 0) {
                this.lib.message.alert('请至少选择一条数据')
                return false
            }

            this.lib.message.confirm(`确认上传${all ? '全部' : '所选'}内容？`, '即将上传', () => {
                if (this.onUpload) {
                    const data = this.composeData(list)
                    if (data.length) {
                        this.onUpload(data)
                    } else {
                        this.lib.message.alert('请至少选择一项字段首选项')
                    }
                }
            })
        },
        composeData: function (list) {
            const titles = this.titles[this.activeName]
            const data = []

            for (let item of list) {
                const subItem = {}
                for (let n in titles) {
                    if (n in item && titles[n]) {
                        subItem[titles[n]] = item[n].toString()
                    }
                }
                if (Object.keys(subItem).length) {
                    data.push(subItem)
                }
            }

            return data
        }
    },
    data () {
        return {
            activeName: '',
            onselect: {},
            checked: {},
            titles: {},
            page: {}
        }
    }
}
</script>

<style src="../../eTable/css/eTable-modify.css"></style>
<style>
.sheetsTable .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover,
.sheetsTable .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #5F75ED;
}
</style>
<style scoped>
.button {
    margin-top: 15px;
    text-align: right;
}

.op-title {
    margin-right: 20px;
    float: left;
}

.op-checked {
    color: #3db700;
    float: right;
}
</style>
