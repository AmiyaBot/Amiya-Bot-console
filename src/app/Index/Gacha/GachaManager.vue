<template>
    <div class="GachaManager">
        <eTable :fields="table.fields"
                :data="table.data"
                :total-page="table.total"
                :list-loader="loadPool">

            <template v-slot:top>
                <el-button type="success" @click="addPool">新增卡池</el-button>
            </template>

            <template v-slot:custom="{ field, value }">
                <div v-if="field.field === 'limit_pool'">
                    <span v-if="value === 0">普通卡池</span>
                    <span class="tag tag1" v-if="value === 1">限定卡池</span>
                    <span class="tag tag2" v-if="value === 2">联合寻访</span>
                </div>
                <div v-if="['pickup_6', 'pickup_5', 'pickup_4'].indexOf(field.field) >= 0">
                    <span class="tag" v-for="(item, index) in value" :key="index">{{ item }}</span>
                </div>
                <div v-if="field.field === 'pickup_s'">
                    <span class="tag" v-for="(item, index) in value" :key="index">{{ item.replace('|', ' X ') }}</span>
                </div>
            </template>

            <template v-slot:row="{ item }">
                <el-button type="text">修改</el-button>
                <el-button type="text">删除</el-button>
            </template>

        </eTable>

        <eWindow :title="(form.type === 1 ? '修改' : '新增') + '卡池'" ref="window">
            <eForm :build-data="form.fields" ref="form">
                <el-button type="primary" @click="submitManage()">提交</el-button>
            </eForm>
        </eWindow>
    </div>
</template>

<script>
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'
import eForm from '@/components/eForm/comp/eForm'
import {tableFields, formFields} from '@/app/Index/Gacha/Gacha'

export default {
    name: 'GachaManager',
    components: {
        eWindow,
        eTable,
        eForm
    },
    methods: {
        loadPool: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/pool/getPoolsByPages',
                data: {
                    page,
                    pageSize,
                    search
                },
                success: res => {
                    for (let item of res.data.data) {
                        for (let name of ['pickup_6', 'pickup_5', 'pickup_4', 'pickup_s']) {
                            item[name] = item[name] ? item[name].split(',') : []
                        }
                    }
                    this.$set(this.table, 'data', res.data.data)
                    this.$set(this.table, 'total', res.data.count)
                }
            })
        },
        addPool: function () {
            this.$refs.window.show()
            this.$nextTick(() => {
                this.$refs.form.reset()
            })
        },
        submitManage: function () {

        }
    },
    data () {
        return {
            table: {
                fields: tableFields,
                data: [],
                total: 0
            },
            form: {
                fields: formFields,
                type: 0
            }
        }
    },
    mounted () {
        this.loadPool()
    }
}
</script>

<style scoped>
.GachaManager {
    width: 100%;
    height: 100%;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 #d8d8d8;
    border-radius: 12px;
}

.tag {
    font-size: 13px;
    padding: 3px 5px;
    margin-right: 5px;
    border-radius: 4px;
    background: #f1f1f1;
}

.tag.tag1 {
    color: #fff;
    background: #ff6328;
}

.tag.tag2 {
    color: #fff;
    background: #7350ff;
}
</style>
