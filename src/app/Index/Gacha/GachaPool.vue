<template>
    <div>
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadPool">

            <template v-slot:top>
                <el-button type="success" @click="customPool(null, 0)">新增卡池</el-button>
            </template>

            <template v-slot:custom="{ field, value }">
                <template v-if="field.field === 'limit_pool'">
                    <span v-if="value === 0">普通卡池</span>
                    <span class="tag tag1" v-if="value === 1">限定卡池</span>
                    <span class="tag tag2" v-if="value === 2">联合寻访</span>
                </template>
                <template v-if="['pickup_6', 'pickup_5', 'pickup_4'].indexOf(field.field) >= 0">
                    <span class="tag" v-for="(item, index) in value" :key="index">{{ item }}</span>
                </template>
                <template v-if="field.field === 'pickup_s'">
                    <span class="tag" :key="index"
                          v-for="(item, index) in pickupSList(value)">
                        {{ item }}
                    </span>
                </template>
            </template>

            <template v-slot:row="{ item }">
                <el-button type="text" @click="customPool(item, 1)">修改</el-button>
                <el-button type="text" @click="delPool(item)">删除</el-button>
            </template>

        </e-table>

        <e-window :title="(form.type === 1 ? '修改' : '新增') + '卡池'" ref="window">
            <eForm :build-data="form.fields" ref="form">
                <el-button type="primary" @click="submitManage()">提交</el-button>
                <el-button @click="setSpOperator">设置自定义干员</el-button>
            </eForm>

            <e-window title="设置自定义干员" ref="spOperator">
                <el-alert title="为什么要设置自定义干员？" :closable="false">
                    <div class="alert">
                        自定义干员为不存在游戏内的干员或因为其他因素无法获取资源的干员，此类干员不具备干员ID（char_id），即使在对应星级的UP干员内设置，仍无法在抽卡时为其匹配
                        <span>星级</span>、<span>职业</span> 以及 <span>立绘</span> 等信息。
                    </div>
                </el-alert>
                <br>
                <e-table :fields="spForm.spTable"
                         :data="spForm.spList"
                         :operation-mode="false"
                         :auto-reset="false"
                         :pagination="false"
                         :selection="false">
                    <template v-slot:custom="{ field, value, index, item }">
                        <div v-if="field.field === 'rarity'">
                            <el-select v-model="spForm.spList[index].rarity" placeholder="请选择星级" size="mini">
                                <el-option v-for="item in [1, 2, 3, 4, 5, 6]"
                                           :key="item"
                                           :label="item + '星'"
                                           :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-if="field.field === 'classes'">
                            <el-select v-model="spForm.spList[index].classes" placeholder="请选择职业" size="mini">
                                <el-option v-for="(item, value) in classes"
                                           :key="value"
                                           :label="item"
                                           :value="value">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-if="field.field === 'image'">
                            <el-button type="text" @click="upload(index, item)">点击上传</el-button>
                            <el-button type="text" @click="showImage(item)" v-if="value">预览</el-button>
                        </div>
                    </template>
                </e-table>
            </e-window>
        </e-window>
        <e-upload ref="upload" url="/pool/uploadImage" :on-upload="onUpload"></e-upload>
    </div>
</template>

<script>
import eForm from '@/components/eForm/comp/eForm'
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'
import eUpload from '@/components/eUpload/comp/eUpload'
import {poolTableFields, poolFormFields, poolSpTableFields, classes} from '@/app/Index/Gacha/Gacha'

export default {
    name: 'GachaPool',
    components: {
        eUpload,
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
        pickupSList: function (value) {
            if (value) {
                return value.split(',').map(n => n.replace('|', ' X '))
            }
            return []
        },
        getAllOperator: function (callback) {
            this.lib.requests.post({
                url: '/operator/getAllOperator',
                success: res => {
                    const data = {}
                    const list = []
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

                        list.push(option)
                    }
                    this.$set(this, 'operators', data)
                    this.$set(this, 'operatorsList', list)

                    callback && callback()
                }
            })
        },
        customPool: function (item, type) {
            this.form.type = type
            this.$refs.window.show()
            this.$nextTick(() => {
                this.$refs.form.setOptions({
                    'pickup_6': this.operators[6],
                    'pickup_5': this.operators[5],
                    'pickup_4': this.operators[4]
                })

                if (type) {
                    this.$refs.form.setValue(item)
                } else {
                    this.$refs.form.cleanForm()
                }
                this.$refs.form.setDisabled('pool_name', type === 1)

                this.$set(this.spForm, 'spList', item['sp_list'] || [])
            })
        },
        delPool: function (item) {
            this.lib.message.confirm(`确定删除卡池【${item['pool_name']}】吗？`, '请确认', () => {
                this.lib.requests.post({
                    url: '/pool/delPool',
                    data: {
                        pool_name: item['pool_name']
                    },
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

            data['sp_list'] = this.spForm.spList

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
        },
        setSpOperator: function () {
            this.$refs.spOperator.show()
            this.formChange()
        },
        formChange: function () {
            let data = this.$refs.form.getValue()
            let spList = []

            let spListMap = {}
            for (let item of this.spForm.spList) {
                spListMap[item.operator_name] = this.lib.common.shallowCopy(item)
            }

            for (let field of ['pickup_6', 'pickup_5', 'pickup_4']) {
                for (let item of data[field]) {
                    if (item in spListMap) {
                        spList.push(spListMap[item])
                    } else {
                        spList.push({
                            operator_name: item,
                            rarity: '',
                            classes: '',
                            image: ''
                        })
                    }
                }
            }

            this.$set(this.spForm, 'spList', spList)
        },
        upload: function (index, item) {
            this.$refs.upload.upload(index, item.operator_name + '.png')
        },
        onUpload: function (index, path) {
            this.spForm.spList[index].image = path
        },
        showImage: function (item) {
            window.open(`http://${window.serverHost}/images?filename=${item.image}`)
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
            spForm: {
                spTable: poolSpTableFields,
                spList: []
            },
            classes: classes,
            operators: {},
            operatorsList: []
        }
    },
    mounted () {
        this.getAllOperator(this.loadPool)
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

.alert > span {
    color: #7350ff;
}
</style>
