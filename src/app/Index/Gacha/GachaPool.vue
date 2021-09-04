<template>
    <div class="shadow-box">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadPool">

            <template v-slot:top>
                <el-button type="success" @click="customPool(null, 0)">新增卡池</el-button>
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
                <el-button type="text" @click="customPool(item, 1)">修改</el-button>
                <el-button type="text" @click="delPool(item)">删除</el-button>
            </template>

        </e-table>

        <e-window :title="(form.type === 1 ? '修改' : '新增') + '卡池'" ref="window">
            <eForm :build-data="form.fields" ref="form">
                <el-button type="primary" @click="submitManage()">提交</el-button>
            </eForm>
        </e-window>
    </div>
</template>

<script>
import eForm from '@/components/eForm/comp/eForm'
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'
import {poolTableFields, poolFormFields} from '@/app/Index/Gacha/Gacha'

export default {
    name: 'GachaPool',
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
                    for (let item of res.data) {
                        for (let name of ['pickup_6', 'pickup_5', 'pickup_4']) {
                            item[name] = item[name] ? item[name].split(',') : []
                        }
                    }
                    this.$set(this.table, 'data', res.data)
                    this.$set(this.table, 'total', res.count)
                }
            })
        },
        getAllOperator: function () {
            this.lib.requests.post({
                url: '/operator/getAllOperator',
                success: res => {
                    const data = {}
                    for (let item of res) {
                        const rarity = item['rarity']
                        const option = item['name']

                        if (rarity in data) {
                            data[rarity][option] = option
                        } else {
                            data[rarity] = {
                                [option]: option
                            }
                        }
                    }
                    this.$set(this, 'operators', data)
                }
            })
        },
        windowOpen: function (callback) {
            this.$refs.window.show()
            this.$nextTick(() => {
                this.$refs.form.setOptions({
                    'pickup_6': this.operators[6],
                    'pickup_5': this.operators[5],
                    'pickup_4': this.operators[4]
                })
                callback && callback()
            })
        },
        customPool: function (item, type) {
            this.form.type = type
            this.windowOpen(() => {
                if (type) {
                    this.$refs.form.setValue(item)
                } else {
                    this.$refs.form.cleanForm()
                }
                this.$refs.form.setDisabled('pool_name', type === 1)
            })
        },
        delPool: function (item) {
            this.lib.message.confirm(`确定删除卡池【${item['pool_name']}】吗？`, '请确认', () => {
                this.lib.requests.post({
                    url: '/pool/delPool',
                    data: item,
                    successMessage: true,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
        },
        submitManage: function () {
            const data = this.$refs.form.getValue()
            const url = this.form.type === 1 ? '/pool/editPool' : '/pool/addNewPool'

            data['pickup_6'] = data['pickup_6'].join(',')
            data['pickup_5'] = data['pickup_5'].join(',')
            data['pickup_4'] = data['pickup_4'].join(',')

            if (data['pool_name'] === '') {
                this.lib.message.toast('卡池名称不能为空', 'error')
                return
            }

            this.lib.requests.post({
                url: url,
                data: data,
                successMessage: true,
                success: res => {
                    this.$refs.window.hide()
                    if (this.form.type) {
                        this.$refs.table.loadList()
                        return
                    }
                    this.loadPool()
                }
            })
        }
    },
    data () {
        return {
            table: {
                fields: poolTableFields,
                data: [],
                total: 0
            },
            form: {
                fields: poolFormFields,
                type: 0
            },
            operators: {}
        }
    },
    mounted () {
        this.loadPool()
        this.getAllOperator()
    }
}
</script>

<style scoped>
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
