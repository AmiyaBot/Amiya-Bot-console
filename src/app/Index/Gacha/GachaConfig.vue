<template>
    <div class="shadow-box">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadConfig">

            <template v-slot:top>
                <el-button type="success" @click="customConfig(null, 0)">新增干员</el-button>
            </template>

            <template v-slot:custom="{ field, value }">
                <div v-if="field.field === 'operator_type'">{{ operatorType[value] }}</div>
            </template>

            <template v-slot:row="{ item }">
                <el-button type="text" @click="customConfig(item, 1)">修改</el-button>
                <el-button type="text" @click="delConfig(item)">删除</el-button>
            </template>

        </e-table>

        <e-window :title="(form.type === 1 ? '修改' : '新增') + '干员'" ref="window">
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
import {operatorType, configTableFields, configFormFields} from '@/app/Index/Gacha/Gacha'

export default {
    name: 'GachaConfig',
    components: {
        eWindow,
        eTable,
        eForm
    },
    methods: {
        loadConfig: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/operator/getOperatorGachaConfig',
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
        customConfig: function (item, type) {
            this.form.type = type
            this.$refs.window.show()
            this.$nextTick(() => {
                if (type) {
                    this.$refs.form.setValue(item)
                } else {
                    this.$refs.form.cleanForm()
                }
            })
        },
        delConfig: function (item) {
            this.lib.message.confirm('确定删除该干员配置吗？', '请确认', () => {
                this.lib.requests.post({
                    url: '/operator/delConfig',
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
            const url = this.form.type === 1 ? '/operator/editConfig' : '/operator/addNewConfig'

            if (data['operator_name'] === '') {
                this.lib.message.toast('干员名称不能为空', 'error')
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
                    this.loadConfig()
                }
            })
        }
    },
    data () {
        return {
            table: {
                fields: configTableFields,
                data: [],
                total: 0
            },
            form: {
                fields: configFormFields,
                type: 0
            },
            operatorType: operatorType
        }
    },
    mounted () {
        this.loadConfig()
    }
}
</script>

<style scoped>

</style>
