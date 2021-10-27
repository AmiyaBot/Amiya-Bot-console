<template>
    <div style="height: 100%">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadSetting">

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
                        <el-button type="text" @click="deleteReplace(item)">删除本行规则</el-button>
                        <el-button type="text" @click="deleteReplace(item,'group_all')">删除该群同原字符规则</el-button>
                        <el-button type="text" @click="deleteReplace(item, 'all')">删除所有同原字符规则</el-button>
                    </div>
                </el-popover>
            </template>

        </e-table>
    </div>
</template>

<script>
import eTable from '@/components/eTable/comp/eTable'

export default {
    name: 'SubSettingReplace',
    props: ['data'],
    components: {
        eTable
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

            this.lib.message.confirm(`确定删除规则【${item.origin}】-> 【${item.target}】？`, '注意', () => {
                this.lib.requests.post({
                    url: '/setting/deleteReplaceText',
                    data: data,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
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
    padding: 2px 0;
    margin: 0;
    color: #ff3f3f !important;
}

.delete-button > button:hover {
    text-decoration: underline;
}
</style>
