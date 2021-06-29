<template>
    <div class="UserManager">
        <eTable :fields="table.fields"
                :data="table.data"
                :total-page="table.total"
                :list-loader="loadUsers">

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
                <el-button type="text" v-if="item.black === 0">加入黑名单</el-button>
                <el-button type="text" v-if="item.black === 1">解除黑名单</el-button>
            </template>

        </eTable>
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
                    this.$set(this.table, 'data', res.data.data)
                    this.$set(this.table, 'total', res.data.count)
                }
            })
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
.UserManager {
    width: 100%;
    height: 100%;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 #d8d8d8;
    border-radius: 12px;
}

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
