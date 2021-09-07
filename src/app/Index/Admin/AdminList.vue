<template>
    <div class="shadow-box">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadAdmin">

            <template v-slot:top>
                <el-button type="success" @click="addAdmin(null, 0)">注册管理员</el-button>
            </template>

            <template v-slot:custom="{ field, value }">
                <div v-if="field.field === 'active'">
                    <span class="tag" v-if="value">已启用</span>
                    <span v-else>未启用</span>
                </div>
            </template>

            <template v-slot:row="{ item }">
                <el-button type="text" v-if="item.active === 1" @click="setActive(item,0)">禁用</el-button>
                <el-button type="text" v-if="item.active === 0" @click="setActive(item,1)">启用</el-button>
                <el-button type="text" @click="delAdmin(item)">删除</el-button>
            </template>

        </e-table>
    </div>
</template>

<script>
import eForm from '@/components/eForm/comp/eForm'
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'

export default {
    name: 'AdminList',
    components: {
        eWindow,
        eTable,
        eForm
    },
    methods: {
        loadAdmin: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/admin/getAdminsByPages',
                data: {
                    page,
                    pageSize,
                    search
                },
                success: res => {
                    for (let item of res.data) {
                        item.last_login = this.lib.common.formatDate(item.last_login)
                    }
                    this.$set(this.table, 'data', res.data)
                    this.$set(this.table, 'total', res.count)
                }
            })
        },
        addAdmin: function () {
            this.lib.message.prompt('请输入要注册的管理员ID', '注册管理员', value => {
                this.lib.requests.post({
                    url: '/admin/registerAdmin',
                    data: {
                        user_id: value
                    },
                    successMessage: true,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
        },
        setActive: function (item, status) {
            this.lib.requests.post({
                url: '/admin/setActive',
                data: {
                    user_id: item.user_id,
                    active: status
                },
                successMessage: true,
                success: res => {
                    this.$refs.table.loadList()
                }
            })
        },
        delAdmin: function (item) {
            this.lib.message.confirm(`确定删除管理员【${item.user_id}】吗？将同步删除该管理员的行为记录`, '请确认', () => {
                this.lib.requests.post({
                    url: '/admin/delAdmin',
                    data: {
                        user_id: item.user_id
                    },
                    successMessage: true,
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
                        title: '账户名',
                        field: 'user_id',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '密码',
                        field: 'password',
                        search: false
                    },
                    {
                        title: '最后登录时间',
                        field: 'last_login',
                        search: false
                    },
                    {
                        title: '最后登录IP地址',
                        field: 'last_login_ip',
                        search: false
                    },
                    {
                        title: '是否启用',
                        field: 'active',
                        custom: true,
                        search: {
                            type: 3,
                            data: {
                                0: '启用',
                                1: '禁用'
                            },
                            checked: true
                        }
                    }
                ],
                data: [],
                total: 0
            }
        }
    },
    mounted () {
        this.loadAdmin()
    }
}
</script>

<style scoped>
.tag {
    font-size: 13px;
    color: #fff;
    background: #3cb300;
    padding: 3px 5px;
    border-radius: 4px;
}
</style>
