<template>
    <div class="shadow-box">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadSetting">

            <template v-slot:top>
                <!--
                <el-button @click="exportData">导出所有数据</el-button>
                <el-button @click="() => $refs.upload.upload()">导入数据</el-button>
                -->
                <el-button type="success" @click="() => $refs.ws.show()">白名单设置</el-button>
                <el-button type="danger" @click="() => $refs.bs.show()">黑名单设置</el-button>
            </template>

            <template v-slot:custom="{ item, field, value }">
                <template v-if="['is_global', 'is_active'].indexOf(field.field) >= 0">
                    <el-switch v-model="value"
                               active-color="#13ce66"
                               :active-value="1"
                               :inactive-value="0"
                               @change="changeStatus(item, field.field, value)">
                    </el-switch>
                </template>
            </template>

            <template v-slot:row="{ item }">
                <el-popover placement="top-start" trigger="click">
                    <el-button slot="reference" type="text">删除</el-button>
                    <div class="delete-button">
                        <el-button type="text" @click="deleteReplace(item)">
                            删除<span class="hard">本行</span>规则
                        </el-button>
                        <el-button type="text" v-for="(title, name) in rule" @click="deleteReplace(item, name)"
                                   :key="name">
                            删除<span class="hard">{{ title }}</span>规则
                        </el-button>
                    </div>
                </el-popover>
            </template>

        </e-table>

        <e-window title="白名单设置" ref="ws" :on-close="() => $emit('save')">
            <el-alert title="不需要经过线上审核的单词" :closable="false"></el-alert>
            <el-input placeholder="输入单词，按回车确认" size="small" style="margin: 10px 0" v-model="replaceSetting.input"
                      @change="value => this.addItem(value, 0)"></el-input>
            <div class="wordList" v-if="replaceSetting.permissible.length">
                <div class="wordItem" v-for="(item, index) in replaceSetting.permissible" :key="index">
                    <span>{{ item.text }}</span>
                    <span class="close" @click="delItem(replaceSetting.permissible, index)"></span>
                </div>
            </div>
            <div v-else style="text-align: center">暂无白名单设置</div>
        </e-window>
        <e-window title="黑名单设置" ref="bs" :on-close="() => $emit('save')">
            <el-alert title="禁止使用为被替换词的单词" :closable="false"></el-alert>
            <el-input placeholder="输入单词，按回车确认" size="small" style="margin: 10px 0" v-model="replaceSetting.input"
                      @change="value => this.addItem(value, 1)"></el-input>
            <div class="wordList" v-if="replaceSetting.forbidden.length">
                <div class="wordItem" v-for="(item, index) in replaceSetting.forbidden" :key="index">
                    <span>{{ item.text }}</span>
                    <span class="close" @click="delItem(replaceSetting.forbidden, index)"></span>
                </div>
            </div>
            <div v-else style="text-align: center">暂无黑名单设置</div>
        </e-window>

        <e-upload url="/replace/importReplaceText" accept=".xlsx" :on-upload="() => $refs.table.loadList()"
                  ref="upload"></e-upload>
    </div>
</template>

<script>
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'
import eUpload from '@/components/eUpload/comp/eUpload'

export default {
    name: 'ReplaceManager',
    components: {
        eTable,
        eWindow,
        eUpload
    },
    methods: {
        loadSetting: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/replace/getReplaceTextByPages',
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
        loadReplaceSetting: function () {
            this.lib.requests.post({
                url: '/replace/getTextReplaceSetting',
                success: res => {
                    const permissible = []
                    const forbidden = []

                    for (let item of res) {
                        if (item['status'] === 0) {
                            permissible.push(item)
                        } else {
                            forbidden.push(item)
                        }
                    }

                    this.$set(this.replaceSetting, 'permissible', permissible)
                    this.$set(this.replaceSetting, 'forbidden', forbidden)
                }
            })
        },
        changeStatus: function (item, name, value) {
            let data = JSON.parse(JSON.stringify(item))

            data[name] = value

            this.lib.requests.post({
                url: '/replace/changeReplaceTextStatus',
                data: data,
                success: res => {
                    this.$refs.table.loadList()
                }
            })
        },
        deleteReplace: function (item, name = '') {
            const data = JSON.parse(JSON.stringify(item))

            if (name) {
                data[name] = true
            }

            this.lib.message.confirm(name === 'replace_all' ? data['replace'] : data['origin'], `确定删除${this.rule[name]}规则？`, () => {
                this.lib.requests.post({
                    url: '/replace/deleteReplaceText',
                    data: data,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
        },
        exportData: function () {
            location.href = 'http://' + window.serverHost + '/replace/exportReplaceText'
        },
        addItem: function (text, status) {
            if (!text) {
                return
            }
            this.lib.requests.post({
                url: '/replace/addReplaceSetting',
                data: {
                    text, status
                },
                success: res => {
                    const item = {
                        id: res,
                        text: text,
                        status: text
                    }
                    if (status) {
                        this.replaceSetting.forbidden.push(item)
                    } else {
                        this.replaceSetting.permissible.push(item)
                    }
                    this.replaceSetting.input = ''
                }
            })
        },
        delItem: function (list, index) {
            this.lib.requests.post({
                url: '/replace/deleteReplaceSetting',
                data: list[index],
                success: res => {
                    list.splice(index, 1)
                }
            })
        }
    },
    data () {
        return {
            table: {
                fields: [
                    {
                        title: '提交用户',
                        field: 'user_id',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '所在群组',
                        field: 'group_id',
                        search: {
                            type: 1
                        }
                    },
                    {
                        title: '原字符',
                        field: 'origin',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '替换字符',
                        field: 'replace',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '提交时间',
                        field: 'in_time',
                        custom: value => {
                            return this.lib.common.formatDate(value)
                        },
                        search: false
                    },
                    {
                        title: '是否全局适用',
                        field: 'is_global',
                        custom: true,
                        search: {
                            type: 3,
                            data: {
                                0: '否',
                                1: '是'
                            }
                        }
                    },
                    {
                        title: '是否通过审核',
                        field: 'is_active',
                        custom: true,
                        search: {
                            type: 3,
                            data: {
                                0: '否',
                                1: '是'
                            }
                        }
                    }
                ],
                data: [],
                total: 0
            },
            rule: {
                group_all: '该群全部',
                user_all: '该用户全部',
                group_origin_all: '该群同原字符',
                origin_all: '所有群同原字符',
                replace_all: '所有群同替换字符'
            },
            replaceSetting: {
                input: '',
                permissible: [],
                forbidden: []
            }
        }
    },
    mounted () {
        this.loadSetting()
        this.loadReplaceSetting()
    }
}
</script>

<style scoped>
.delete-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.delete-button > button {
    margin: 0;
    padding: 2px 0;
    color: #3f6fff !important;
}

.delete-button > button span.hard {
    color: #ff3f3f !important;
    padding: 0 2px;
}

.delete-button > button:hover {
    text-decoration: underline;
}

.wordList {
    display: flex;
}

.wordItem {
    background: #f1f1f1;
    border-radius: 4px;
    margin-right: 10px;
    padding: 2px 10px;
    display: flex;
}

.wordItem .close {
    background: url(../../../assets/icon/close-circle.svg) center / 15px no-repeat;
    padding: 10px;
    margin-left: 5px;
    cursor: pointer;
}
</style>
