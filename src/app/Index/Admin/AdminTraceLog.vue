<template>
    <div>
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadAdminTrace">

            <template v-slot:top>
                <el-button type="warning" @click="deleteAdminTrace">清空</el-button>
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
        loadAdminTrace: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/admin/getAdminTraceByPages',
                data: {
                    page,
                    pageSize,
                    search
                },
                success: res => {
                    for (let item of res.data) {
                        item.time = this.lib.common.formatDate(item.time)
                    }
                    this.$set(this.table, 'data', res.data)
                    this.$set(this.table, 'total', res.count)
                }
            })
        },
        deleteAdminTrace: function () {
            this.lib.requests.post({
                url: '/admin/deleteAdminTrace',
                successMessage: true,
                success: res => this.loadAdminTrace()
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
                        title: '调用接口',
                        field: 'interface',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: 'JSON参数',
                        field: 'params',
                        search: false
                    },
                    {
                        title: '时间',
                        field: 'time',
                        search: false
                    }
                ],
                data: [],
                total: 0
            }
        }
    },
    mounted () {
        this.loadAdminTrace()
    }
}
</script>

<style scoped>

</style>
