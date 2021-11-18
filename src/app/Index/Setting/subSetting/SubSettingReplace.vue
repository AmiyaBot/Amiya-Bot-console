<template>
    <div style="height: 100%">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadSetting">

            <template v-slot:top>
                <el-button @click="exportData">导出所有数据</el-button>
                <el-button @click="() => $refs.upload.upload()">导入数据</el-button>
                <el-button type="success" @click="() => $refs.ws.show()">白名单设置</el-button>
                <el-button type="warning" @click="() => $refs.bs.show()">黑名单设置</el-button>
            </template>

            <template v-slot:custom="{ item, field, value }">
                <div v-if="['is_global', 'is_active'].indexOf(field.field) >= 0">
                    <el-switch v-model="value"
                               active-color="#13ce66"
                               :active-value="1"
                               :inactive-value="0"
                               @change="changeStatus(item, field.field, value)">
                    </el-switch>
                </div>
            </template>

            <template v-slot:row="{ item }">
                <el-popover placement="top-start" trigger="click">
                    <el-button slot="reference" type="text">删除</el-button>
                    <div class="delete-button">
                        <el-button type="text" @click="deleteReplace(item)">
                            删除<span class="hard">本行</span>规则
                        </el-button>
                        <el-button type="text" @click="deleteReplace(item,'group_all')">
                            删除<span class="hard">该群全部</span>规则
                        </el-button>
                        <el-button type="text" @click="deleteReplace(item,'user_all')">
                            删除<span class="hard">该用户全部</span>规则
                        </el-button>
                        <el-button type="text" @click="deleteReplace(item,'group_origin_all')">
                            删除<span class="hard">该群同原字符</span>的规则
                        </el-button>
                        <el-button type="text" @click="deleteReplace(item, 'all')">
                            删除<span class="hard">所有群同原字符</span>的规则
                        </el-button>
                    </div>
                </el-popover>
            </template>

        </e-table>

        <e-window title="白名单设置" ref="ws" :on-close="() => $emit('save')">
            <el-alert title="不需要经过线上审核的单词" :closable="false"></el-alert>
            <el-select v-model="data.replaceSetting.permissible" style="width: 100%;margin-top: 10px"
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       placeholder="请添加单词">
                <el-option :disabled="true" label="输入单词，按回车确认" value="">
                </el-option>
            </el-select>
        </e-window>
        <e-window title="黑名单设置" ref="bs" :on-close="() => $emit('save')">
            <el-alert title="禁止使用为被替换词的单词" :closable="false"></el-alert>
            <el-select v-model="data.replaceSetting.forbidden" style="width: 100%;margin-top: 10px"
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       placeholder="请添加单词">
                <el-option :disabled="true" label="输入单词，按回车确认" value="">
                </el-option>
            </el-select>
        </e-window>

        <e-upload url="/setting/importReplaceText" accept=".xlsx" :on-upload="() => $refs.table.loadList()"
                  ref="upload"></e-upload>
    </div>
</template>

<script>
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'
import eUpload from '@/components/eUpload/comp/eUpload'

export default {
    name: 'SubSettingReplace',
    props: ['data'],
    components: {
        eTable,
        eWindow,
        eUpload
    },
    methods: {
        loadSetting: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/setting/getReplaceTextByPages',
                data: {
                    page,
                    pageSize,
                    search
                },
                success: res => {
                    this.$set(this.table, 'data', res.data)
                    this.$set(this.table, 'total', res.count)
                }
            })
        },
        changeStatus: function (item, name, value) {
            let data = JSON.parse(JSON.stringify(item))

            data[name] = value

            this.lib.requests.post({
                url: '/setting/changeReplaceTextStatus',
                data: data,
                success: res => {
                    this.$refs.table.loadList()
                }
            })
        },
        deleteReplace: function (item, extra = '') {
            const data = JSON.parse(JSON.stringify(item))

            if (extra) {
                data[extra] = true
            }

            this.lib.message.confirm(`确定删除规则？`, '注意', () => {
                this.lib.requests.post({
                    url: '/setting/deleteReplaceText',
                    data: data,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
        },
        exportData: function () {
            location.href = 'http://' + window.serverHost + '/setting/exportReplaceText'
        }
    },
    data () {
        return {
            table: {
                fields: [
                    {
                        title: '提交用户',
                        field: 'user_id',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '所在群组',
                        field: 'group_id',
                        search: {
                            type: 1
                        }
                    },
                    {
                        title: '原字符',
                        field: 'origin',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '替换字符',
                        field: 'target',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '提交时间',
                        field: 'in_time',
                        custom: value => {
                            return this.lib.common.formatDate(value)
                        },
                        search: false
                    },
                    {
                        title: '是否全局适用',
                        field: 'is_global',
                        custom: true,
                        search: {
                            type: 3,
                            data: {
                                0: '否',
                                1: '是'
                            }
                        }
                    },
                    {
                        title: '是否通过审核',
                        field: 'is_active',
                        custom: true,
                        search: {
                            type: 3,
                            data: {
                                0: '否',
                                1: '是'
                            }
                        }
                    }
                ],
                data: [],
                total: 0
            }
        }
    },
    mounted () {
        this.loadSetting()
    }
}
</script>

<style scoped>
.delete-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.delete-button > button {
    margin: 0;
    padding: 2px 0;
    color: #3f6fff !important;
}

.delete-button > button span.hard {
    color: #ff3f3f !important;
    padding: 0 2px;
}

.delete-button > button:hover {
    text-decoration: underline;
}
</style>
