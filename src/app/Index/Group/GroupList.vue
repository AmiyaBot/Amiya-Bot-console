<template>
    <div>
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadGroups">

            <template v-slot:top>
                <el-button type="success" @click="refreshGroup()">同步群列表</el-button>
            </template>

            <template v-slot:custom="{ item, field, value }">
                <template v-if="['active', 'send_notice', 'send_weibo'].indexOf(field.field) >= 0">
                    <el-switch v-model="value"
                               active-color="#13ce66"
                               :active-value="1"
                               :inactive-value="0"
                               @change="changeGroupStatus(item, field.field, value)">
                    </el-switch>
                </template>
            </template>

            <template v-slot:row="{ item }">
                <!--<el-button type="text" @click="getGroupMessage(item)">查看群聊</el-button>-->
                <el-button type="text" @click="getMemberList(item)">查看群成员</el-button>
                <el-button type="text" @click="leaveGroup(item)">退出群</el-button>
            </template>

        </e-table>

        <e-window :title="group.group_name" ref="groupMessage">
            <div class="messageWindow">
                <div v-for="(item, index) in groupMessage" :key="index">
                    <div>[{{ item.create_time }}] {{ item.user_id }}</div>
                    <div>{{ item.text }}{{ item.face }}</div>
                    <div v-for="(img, i) in item.image" :key="i">
                        <a :href="img">[图片]</a>
                    </div>
                </div>
            </div>
        </e-window>
    </div>
</template>

<script>
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'
import {tableFields} from '@/app/Index/Group/Group'

export default {
    name: 'GroupList',
    components: {
        eTable,
        eWindow
    },
    methods: {
        loadGroups: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/group/getGroupByPages',
                data: {
                    page,
                    pageSize,
                    search
                },
                success: res => {
                    for (let item of res.data) {
                        if (item['active'] === null) {
                            item['active'] = 1
                        }
                        if (item['send_notice'] === null) {
                            item['send_notice'] = 0
                        }
                        if (item['send_weibo'] === null) {
                            item['send_weibo'] = 0
                        }
                    }
                    this.$set(this.table, 'data', res.data)
                    this.$set(this.table, 'total', res.count)
                }
            })
        },
        getGroupMessage: function (item) {
            this.lib.requests.post({
                url: '/message/getMessageByGroupId',
                data: {
                    group_id: item.group_id
                },
                success: res => {
                    this.$set(this, 'group', item)
                    this.$set(this, 'groupMessage', res.map(row => {
                        row.create_time = this.lib.common.formatDate(row.create_time)
                        row.image = row.image ? row.image.split(',') : []

                        return row
                    }))
                    this.$refs.groupMessage.show()
                }
            })
        },
        getMemberList: function (item) {
            this.lib.requests.post({
                url: '/group/getMemberList',
                data: {
                    group_id: item.group_id
                },
                success: res => {
                }
            })
        },
        changeGroupStatus: function (item, name, value) {
            this.lib.requests.post({
                url: '/group/changeGroupStatus',
                data: {
                    group_id: item.group_id,
                    [name]: value
                },
                success: res => {
                    this.$refs.table.loadList()
                }
            })
        },
        leaveGroup: function (item) {
            this.lib.message.confirm(`确定退出群【${item.group_id}】吗？这将同步删除该群的设置。`, '注意', () => {
                this.lib.requests.post({
                    url: '/group/leaveGroup',
                    data: {
                        group_id: item.group_id
                    },
                    successMessage: true,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
        },
        refreshGroup: function () {
            this.lib.requests.post({
                url: '/group/refreshGroupList',
                success: res => {
                    this.$refs.table.loadList()
                }
            })
        },
        formatDate: function (ts) {
            return this.lib.common.formatDate(ts)
        }
    },
    data () {
        return {
            table: {
                fields: tableFields,
                data: [],
                total: 0
            },
            group: {},
            groupMessage: [],
            notice: ''
        }
    },
    mounted () {
        this.loadGroups()
    }
}
</script>

<style scoped>
.messageWindow {
    height: 400px;
    overflow: auto;
}

.messageWindow > div {
    margin-bottom: 10px;
}

.messageWindow img {
    width: 30%;
}
</style>
