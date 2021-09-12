<template>
    <div class="shadow-box">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadGroupNotice">

            <template v-slot:top>
                <el-button type="success" @click="inputNotice">推送公告</el-button>
            </template>

            <template v-slot:row="{ item }">
                <el-button type="text" @click="pushAgain(item)">再次推送</el-button>
                <el-button type="text" @click="delNotice(item)">删除</el-button>
            </template>

        </e-table>

        <e-window title="推送公告" ref="notice">
            <div style="margin-bottom: 10px">
                <el-input type="textarea" placeholder="请输入内容" :rows="10" v-model="notice"></el-input>
            </div>
            <el-button type="success" @click="pushNotice">推送</el-button>
        </e-window>
    </div>
</template>

<script>
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'
import {noticeTableFields} from '@/app/Index/Group/Group'

export default {
    name: 'GroupNotice',
    components: {
        eTable,
        eWindow
    },
    methods: {
        loadGroupNotice: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/group/getGroupNoticeByPages',
                data: {
                    page,
                    pageSize,
                    search
                },
                success: res => {
                    for (let item of res.data) {
                        item.send_time = this.lib.common.formatDate(item.send_time)
                    }

                    this.$set(this.table, 'data', res.data)
                    this.$set(this.table, 'total', res.count)
                }
            })
        },
        inputNotice: function () {
            this.notice = ''
            this.$refs.notice.show()
        },
        pushNotice: function () {
            this.lib.requests.post({
                url: '/group/pushNotice',
                data: {
                    content: this.notice
                },
                successMessage: true,
                success: res => {
                    this.$refs.table.loadList()
                    this.$refs.notice.hide()
                }
            })
        },
        pushAgain: function (item) {
            this.lib.message.confirm(`确定重新推送该公告吗`, '注意', () => {
                this.notice = item.content
                this.pushNotice()
            })
        },
        delNotice: function (item) {
            this.lib.requests.post({
                url: '/group/delNotice',
                data: item,
                successMessage: true,
                success: res => {
                    this.$refs.table.loadList()
                }
            })
        }
    },
    data () {
        return {
            table: {
                fields: noticeTableFields,
                data: [],
                total: 0
            },
            notice: ''
        }
    },
    mounted () {
        this.loadGroupNotice()
    }
}
</script>

<style scoped>

</style>
