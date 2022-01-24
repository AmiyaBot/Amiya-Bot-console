<template>
    <div :class="uid()">
        <el-form class="formBuilder" :label-position="labelPosition"
                 :model="formData" :rules="rules" :size="size" :inline="inline" :validate-on-rule-change="false">
            <el-form-item v-for="(item, index) in buildData"
                          v-if="displayAll || (displayFilter.indexOf(item.title) >= 0 || displayFilter.indexOf(item.field) >= 0)"
                          :class="item.className"
                          :key="item.field"
                          :prop="item.field"
                          :label-width="labelWidth"
                          :style="{ display: item.config.block ? 'block' : '' }">

                <!-- 输入框 -->
                <el-input v-if="item.config.type === 1"
                          v-model="formData[item.field]"
                          :placeholder="'请输入' + item.title"
                          :disabled="disabledItem[item.field]"
                          :suffix-icon="item.config.disabled ? 'el-icon-remove-outline' : 'el-icon-edit'"
                          :ref="item.field"
                          @change="formChange(item.field, formData[item.field])"
                          @input="formChange(item.field, formData[item.field], 'input')"
                          class="input-only" :class="'input-index-' + index">
                </el-input>

                <!-- 数字输入框 -->
                <el-input-number v-if="item.config.type === 2"
                                 v-model="formData[item.field]"
                                 :placeholder="'请输入' + item.title"
                                 :disabled="disabledItem[item.field]"
                                 :ref="item.field"
                                 @change="formChange(item.field, formData[item.field])"
                                 @input="formChange(item.field, formData[item.field], 'input')"
                                 controls-position="right"
                                 class="input-only" :class="'input-index-' + index">
                </el-input-number>

                <!-- 下拉选择框 -->
                <el-select v-if="item.config.type === 3" clearable collapse-tags
                           v-model="formData[item.field]"
                           :filterable="!!item.config.search"
                           :remote="typeof item.config.search === 'function'"
                           :remote-method="value => searchOptions(value, item)"
                           :multiple="item.config.multiple"
                           :placeholder="'请选择' + item.title"
                           :disabled="disabledItem[item.field]"
                           @change="formChange(item.field, formData[item.field])">
                    <el-option v-for="(t, v) in optionsData[item.field]"
                               :label="t"
                               :value="v"
                               :key="v">
                    </el-option>
                </el-select>

                <!-- 下拉表格选择框 -->
                <table-selector v-if="item.config.type === 31"
                                :table-data="optionsData[item.field]"
                                :table-field="item.config.table.fields"
                                :search="item.config.table.search"
                                :input-value="formData[item.field]"
                                :virtual="item.config.virtual"
                                :field="item.field"
                                :bind="formData"
                                :selected="events.selected[item.field]"
                                :setVirtual="setVirtual"
                                :ref="'tableSelector' + index"
                                @dataChange="data => setOptions(item.field, data, true)"
                                @inputEmpty="() => cleanForm(item.field)">
                    <template slot-scope="event">
                        <el-input v-model="formData[item.field]"
                                  :placeholder="'请选择' + item.title"
                                  :disabled="disabledItem[item.field]"
                                  :readonly="typeof item.config.table.search != 'function'"
                                  :ref="item.field"
                                  @input="event.input"
                                  @focus="event.show(true, $event)"
                                  @blur="event.show(false, $event)"
                                  @change="formChange(item.field, formData[item.field])">
                            <i slot="suffix" class="el-input__icon el-icon-circle-close"
                               @click="() => cleanForm(item.field)"></i>
                        </el-input>
                    </template>
                </table-selector>

                <!-- 下拉树形选择框 -->
                <tree-selector v-if="item.config.type === 32"
                               :tree="item.config.tree"
                               :tree-data="optionsData[item.field]"
                               :virtual="item.config.virtual"
                               :field="item.field"
                               :bind="formData"
                               :selected="events.selected[item.field]"
                               :setVirtual="setVirtual"
                               @dataChange="data => setOptions(item.field, data, true)">
                    <template slot-scope="event">
                        <el-input v-model="formData[item.field]" readonly class="tree-selector"
                                  :placeholder="'请选择' + item.title"
                                  :disabled="disabledItem[item.field]"
                                  :ref="item.field"
                                  @focus="event.show(true, $event)"
                                  @blur="event.show(false, $event)"
                                  @change="formChange(item.field, formData[item.field])">
                            <i slot="suffix" class="el-input__icon el-icon-circle-close"
                               @click="() => cleanForm(item.field)"></i>
                        </el-input>
                    </template>
                </tree-selector>

                <!-- 级联选择器 -->
                <el-cascader v-if="item.config.type === 33" collapse-tags clearable
                             v-model="formData[item.field]"
                             :placeholder="'请选择' + item.title"
                             :options="optionsData[item.field]"
                             :props="item.config.props"
                             :ref="item.field"
                             @change="formChange(item.field, formData[item.field])"></el-cascader>

                <!-- 日期选择器（包含"日期"、"日期时间"和两者的范围选择） -->
                <el-date-picker v-if="item.config.type in datePickerType && item.field in datePicker"
                                v-model="datePicker[item.field].value"
                                :type="datePickerType[item.config.type]"
                                :disabled="disabledItem[item.field]"
                                @change="formChange(item.field, formData[item.field])"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                placeholder="请选择日期">
                </el-date-picker>

                <!-- 单选框 -->
                <el-radio-group v-if="item.config.type === 6"
                                v-model="formData[item.field]"
                                :disabled="disabledItem[item.field]"
                                @change="formChange(item.field, formData[item.field])">
                    <el-radio v-for="(t, v) in optionsData[item.field]"
                              :label="v"
                              :key="v">{{ t }}
                    </el-radio>
                </el-radio-group>

                <!-- 多选框 -->
                <el-checkbox-group v-if="item.config.type === 7"
                                   v-model="formData[item.field]"
                                   :disabled="disabledItem[item.field]"
                                   @change="formChange(item.field, formData[item.field])">
                    <el-checkbox v-for="(t, v) in optionsData[item.field]"
                                 :label="v"
                                 :key="v">{{ t }}
                    </el-checkbox>
                </el-checkbox-group>

                <!-- 切换按钮 -->
                <el-switch v-if="item.config.type === 8"
                           v-model="formData[item.field]"
                           :disabled="disabledItem[item.field]"
                           :active-color="item.config.activeColor"
                           :active-text="item.config.activeText"
                           :active-value="item.config.activeValue"
                           :inactive-color="item.config.inactiveColor"
                           :inactive-text="item.config.inactiveText"
                           :inactive-value="item.config.inactiveValue"
                           @change="formChange(item.field, formData[item.field])">
                </el-switch>

                <el-tooltip v-if="item.config.tips && !item.config.labelTips"
                            :content="item.config.tips"
                            effect="dark"
                            placement="top">
                    <span class="el-icon-question"></span>
                </el-tooltip>

                <template v-slot:label>
                    <span>{{ item.title }}</span>
                    <el-tooltip v-if="item.config.tips && item.config.labelTips"
                                :content="item.config.tips"
                                effect="dark"
                                placement="top">
                        <span class="el-icon-question"></span>
                    </el-tooltip>
                </template>

            </el-form-item>
            <el-form-item style="display: none">
                <el-input></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import eFormProps from '@/components/eForm/js/eFormProps'
import treeSelector from '@/components/eForm/comp/treeSelector'
import tableSelector from '@/components/eForm/comp/tableSelector'
import $ from 'jquery'

export default {
    name: 'formBuilder',
    props: eFormProps,
    components: {
        treeSelector,
        tableSelector
    },
    watch: {
        datePicker: {
            handler: function () {
                function getTime (v) {
                    return Math.ceil(new Date(v) / 1000)
                }

                for (let i in this.datePicker) {
                    let item = this.datePicker[i]

                    if (item.value === null) {
                        this.formData[i] = item.default()
                        // this.datePicker[i].value = item.default()
                        continue
                    }

                    if (Array.isArray(item.value)) {
                        const start = getTime(item.value[0])
                        const end = getTime(item.value[1])

                        if (start === 0 && end === 0) {
                            this.formData[i] = item.default()
                            // this.datePicker[i].value = item.default()
                        } else {
                            this.formData[i][0] = item.value[0] ? start : 0
                            this.formData[i][1] = item.value[1] ? end : 0
                        }
                    } else {
                        this.formData[i] = item.value ? getTime(item.value) : 0
                    }
                }
            },
            deep: true
        },
        formData: {
            handler: function (value) {
                if (this.ready) {
                    this.$emit('change', value)
                }
            },
            deep: true
        }
    },
    methods: {
        uid: function () {
            return 'formBuilder' + this['_uid']
        },
        init: function () {
            let rules = {}
            let jumps = {}
            let formData = {}
            let datePicker = {}
            let optionsData = {}
            let virtualData = {}
            let disabledItem = {}
            let events = {
                selected: {},
                change: {},
                input: {}
            }

            this.ready = false

            for (let index in this.buildData) {
                const item = this.buildData[index]

                // 过滤不需要显示的表单内容
                if (!this.displayAll &&
                    (this.displayFilter.indexOf(item.title) < 0 && this.displayFilter.indexOf(item.field) < 0)) {
                    continue
                }

                // 初始数据与类型
                const initOptions = () => {
                    if (type === 3) {
                        this.searchOptions('', item)
                    }
                    if (typeof item.config.data === 'function') {
                        optionsData[item.field] = [31, 32, 33].indexOf(type) >= 0 ? [] : {}
                        item.config.data(options => optionsData[item.field] = options)
                    } else {
                        const options = this.optionsData[item.field]
                        if (options && (Array.isArray(options) ? options : Object.keys(options)).length) {
                            optionsData[item.field] = options
                        } else {
                            optionsData[item.field] = item.config.data
                        }
                    }
                }

                let type = item.config.type
                let value = item.config.default

                if (item.field in this.formData &&
                    this.formData[item.field] !== undefined &&
                    this.formData[item.field] !== '' && !(type === 8 && 'default' in item.config)) {
                    value = this.formData[item.field]
                }

                // 初始化校验规则
                const trigger = 'change'

                rules[item.field] = []

                if (item.config.required) {
                    rules[item.field].push({
                        required: true,
                        message: item.title + '不能为空',
                        trigger: trigger
                    })
                }
                if (item.config.rule) {
                    rules[item.field].push({
                        validator: (rule, value, callback) => {
                            const message = item.config.rule(value)
                            if (message) {
                                callback(new Error(message))
                                return false
                            }
                            callback()
                        },
                        trigger: trigger
                    })
                }

                // 初始化禁用列表
                let isDisabled = !!item.config.disabled
                if (item.field in this.disabledItem && this.disabledItem[item.field]) {
                    isDisabled = true
                }
                disabledItem[item.field] = isDisabled

                // 初始化虚拟字段值
                if (item.config.virtual) {
                    virtualData[item.field] = (item.field in this.virtualData ? this.virtualData[item.field] : value) || ''
                }

                // 初始化 change 触发事件
                if (item.config.event) {
                    for (let ev of Object.keys(events)) {
                        if (ev in item.config.event) {
                            events[ev][item.field] = item.config.event[ev]
                        }
                    }
                }

                // 初始化表单数据和初始值
                switch (type) {
                    case 1:
                    case 2:
                        // 初始化跳转列表
                        if (!item.config.disabled) {
                            jumps[index] = {
                                field: item.field,
                                rule: item.config.rule,
                                required: item.config.required
                            }
                        }
                        formData[item.field] = value || ''
                        break
                    case 3:
                        // 下拉选择框
                        initOptions()
                        if (item.config.multiple) {
                            formData[item.field] = (value || []).map(v => v.toString())
                        } else {
                            formData[item.field] = (value || '').toString()
                        }
                        break
                    case 31:
                    case 32:
                    case 33:
                        // 下拉表格、树形选择框、级联选择器
                        initOptions()
                        formData[item.field] = value || ''
                        break
                    case 4:
                    case 41:
                        // 日期（3）和日期范围（31）选择器
                        datePicker[item.field] = {
                            default: () => 0,
                            value: value ? this.newData(value) : ''
                        }
                        formData[item.field] = value || 0
                        break
                    case 5:
                    case 51:
                        // 日期时间（4）和日期时间范围（41）选择器
                        datePicker[item.field] = {
                            default: () => [0, 0],
                            value: value ? [this.newData(value[0]), this.newData(value[1])] : ['', '']
                        }
                        formData[item.field] = value || [0, 0]
                        break
                    case 6:
                    case 7:
                        // 单选框与多选框
                        initOptions()
                        if (type === 7) {
                            formData[item.field] = (value || []).map(v => v.toString())
                        } else {
                            formData[item.field] = (value || '').toString()
                        }
                        break
                    case 8:
                        // 切换按钮
                        formData[item.field] = value === undefined ? false : value
                }
            }

            this.$set(this, 'rules', rules)
            this.$set(this, 'jumps', jumps)
            this.$set(this, 'events', events)
            this.$set(this, 'formData', formData)
            this.$set(this, 'datePicker', datePicker)
            this.$set(this, 'optionsData', optionsData)
            this.$set(this, 'virtualData', virtualData)
            this.$set(this, 'disabledItem', disabledItem)
            this.$nextTick(() => {
                $(`.${this.uid()} .input-only`).off('keydown').keydown(e => {
                    if (e.keyCode === 13) {
                        if (this.formType === 'Search') {
                            this.$emit('search')
                        } else {
                            const index = parseInt(
                                $(e.target)
                                    .closest('.input-only')[0]
                                    .className
                                    .match(/input-index-(\d+)/)[1]
                            )
                            this.autoJump(index)
                        }
                    }
                })
                this.reviewOptions()
                this.ready = true
            })
        },
        autoJump: function (index) {
            const item = this.jumps[index]
            const value = this.formData[item.field]

            if (value === '' && item.required) {
                return false
            }
            if (item.rule && item.rule(value)) {
                this.$refs[item.field][0].select()
                return false
            }

            const indexList = Object.keys(this.jumps).map(n => parseInt(n))
            const curr = indexList.indexOf(index)
            const next = indexList[curr + 1]
            const target = this.jumps[next]

            if (target) {
                this.$refs[target.field][0].focus()
            } else {
                this.beforeSubmit(this.formData)
            }
        },
        searchOptions: function (value, item) {
            if (typeof item.config.search === 'function') {
                item.config.search(value, options => this.optionsData[item.field] = options)
            }
        },
        formChange: function (field, value, type = 'change') {
            if (field in this.events[type]) {
                if (value.constructor === Boolean) {
                    value = value ? 1 : 0
                }
                this.events[type][field](
                    JSON.parse(
                        JSON.stringify(value)
                    )
                )
            }
        },
        setValue: function (field, value) {
            if (field.constructor === Object) {
                for (let name in field) {
                    this.setValue(name, field[name])
                }
                return false
            }

            const set = (transBool = false) => {
                if (field in this.virtualData) {
                    this.virtualData[field] = transBool ? !!value : value
                } else {
                    this.formData[field] = transBool ? !!value : value
                }
            }

            for (let index in this.buildData) {
                let item = this.buildData[index]
                if (field === item.field) {
                    switch (item.config.type) {
                        case 3:
                            if (Array.isArray(value)) {
                                value = value.map(n => n.toString())
                            } else {
                                value = value.toString()
                            }
                            set()
                            break
                        case 31:
                            set()
                            this.$refs['tableSelector' + index][0].doSearch(value)
                            continue
                        case 4:
                        case 41:
                            this.datePicker[item.field].value = value ? this.newData(value) : ''
                            break
                        case 5:
                        case 51:
                            this.datePicker[item.field].value = value ? [this.newData(value[0]), this.newData(value[1])] : ['', '']
                            break
                        default:
                            set()
                    }
                    this.reviewOptions(field)
                    break
                }
            }
        },
        setOptions: function (field, data, review = true) {
            this.$set(this.optionsData, field, data)
            if (review) {
                this.reviewOptions(field)
            }
        },
        setDisabled: function (field, value) {
            this.$set(this.disabledItem, field, value)
        },
        setVirtual: function (field, value) {
            if (field in this.virtualData) {
                this.$set(this.virtualData, field, value)
            }
        },
        reviewOptions: function (field) {
            const review = (options, item) => {
                for (let n in options) {
                    const option = options[n]
                    const valueField = item.config.virtual.value || item.field

                    if (option[valueField] === this.virtualData[item.field]) {
                        this.formData[item.field] = option[item.config.virtual.show]
                        return true
                    }
                    if ('children' in option && Array.isArray(option.children) && option.children.length) {
                        const done = review(option.children, item)
                        if (done) {
                            return true
                        }
                    }
                }
            }

            // 不敢相信还是实现了回显...但愿我以后还能读懂这里...
            for (let item of this.buildData) {
                const options = this.optionsData[item.field]
                if (
                    options &&
                    item.field in this.optionsData &&
                    item.field in this.virtualData &&
                    item.config.virtual &&
                    'show' in item.config.virtual &&
                    !(field && item.field !== field)
                ) {
                    review(options, item)
                }
            }
        },
        newData: function (value) {
            return new Date(value * (value.toString().length < 13 ? 1000 : 1))
        },
        cleanForm: function (field) {
            for (let item of this.buildData) {
                if (field && field !== item.field) {
                    continue
                }

                if (item.field in this.virtualData) {
                    this.virtualData[item.field] = ''
                }

                switch (item.config.type) {
                    case 3:
                        if (item.config.multiple) {
                            this.formData[item.field] = []
                        } else {
                            this.formData[item.field] = ''
                        }
                        break
                    case 4:
                    case 41:
                        this.datePicker[item.field].value = ''
                        break
                    case 5:
                    case 51:
                        this.datePicker[item.field].value = ['', '']
                        break
                    case 6:
                    case 7:
                        if (item.config.type === 7) {
                            this.formData[item.field] = []
                        } else {
                            this.formData[item.field] = ''
                        }
                        break
                    case 8:
                        this.formData[item.field] = item.config.inactiveValue === undefined ? false : item.config.inactiveValue
                        break
                    default:
                        this.formData[item.field] = ''
                }
            }
        }
    },
    data () {
        return {
            rules: {},
            jumps: [],
            formData: {},
            datePicker: {},
            optionsData: {},
            virtualData: {},
            disabledItem: {},
            datePickerType: {
                4: 'date',
                41: 'datetime',
                5: 'daterange',
                51: 'datetimerange'
            },
            events: {
                selected: {},
                change: {},
                input: {}
            },
            ready: false
        }
    }
}
</script>

<style src="../css/eForm-modify.css"></style>
<style scoped>
.el-icon-question {
    font-size: 18px;
    color: #6f6f6f;
    cursor: pointer;
}

.el-icon-circle-close {
    cursor: pointer;
}
</style>
