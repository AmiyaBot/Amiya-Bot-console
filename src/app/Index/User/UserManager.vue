<template>
    <div class="shadow-box">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadUsers">

            <template v-slot:top>
                <el-button type="success" @click="sendCoupon(null)">全体发放凭证</el-button>
            </template>

            <template v-slot:operations="{ items }">
                <el-button type="success" size="small" @click="sendCoupon(items)">发放凭证</el-button>
            </template>

            <template v-slot:custom="{ field, value }">
                <div v-if="field.field === 'sign_in'">
                    <span class="tag" v-if="value">已签到</span>
                    <span v-else>未签到</span>
                </div>
                <div v-if="field.field === 'black'">
                    <span class="tag black" v-if="value">黑名单</span>
                    <span v-else>正常</span>
                </div>
            </template>

            <template v-slot:row="{ item }">
                <el-button type="text" v-if="item.black === 0" @click="setBlackUser(item, 1)">加入黑名单</el-button>
                <el-button type="text" v-if="item.black === 1" @click="setBlackUser(item, 0)">解除黑名单</el-button>
            </template>

        </e-table>
    </div>
</template>

<script>
import eTable from '@/components/eTable/comp/eTable'
import {tableFields} from '@/app/Index/User/User'

export default {
    name: 'UserManager',
    components: {
        eTable
    },
    methods: {
        loadUsers: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/user/getUsersByPages',
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
        setBlackUser: function (item, status) {
            const text = status ? `是否添加用户${item['user_id']}至黑名单` : `是否解除用户${item['user_id']}的黑名单`
            this.lib.message.confirm(text, '注意', () => {
                this.lib.requests.post({
                    url: '/user/setBlackUser',
                    data: {
                        user_id: item['user_id'],
                        black: status
                    },
                    successMessage: true,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
        },
        sendCoupon: function (items) {
            let users = []
            if (Array.isArray(items)) {
                if (items.length) {
                    users = items.map(n => n['user_id'])
                } else {
                    this.lib.message.alert('请至少选择一个用户')
                    return
                }
            }

            this.lib.message.prompt('输入发放数量', '发放凭证', value => {
                this.lib.requests.post({
                    url: '/user/sendCoupon',
                    data: {
                        users,
                        value
                    },
                    successMessage: true,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            }, 'number')
        }
    },
    data () {
        return {
            table: {
                fields: tableFields,
                data: [],
                total: 0
            }
        }
    },
    mounted () {
        this.loadUsers()
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

.tag.black {
    background: #5d5d5d;
}
</style>
