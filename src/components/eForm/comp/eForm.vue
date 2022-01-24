<template>
    <div class="eForm">
        <formBuilder ref="form" @change="data => $emit('change', data)"
                     :size="size"
                     :inline="inline"
                     :label-width="labelWidth"
                     :build-data="buildData"
                     :display-filter="displayFilter"
                     :display-all="displayAll"
                     :label-position="labelPosition"
                     :before-submit="beforeSubmit"></formBuilder>
        <el-form class="formBuilder" label-position="left">
            <slot name="item"></slot>
            <el-form-item :label="' '"
                          :label-width="labelWidth">
                <slot></slot>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import formBuilder from '@/components/eForm/comp/formBuilder'
import eFormProps from '@/components/eForm/js/eFormProps'

export default {
    name: 'eForm',
    props: eFormProps,
    components: {
        formBuilder
    },
    methods: {
        focus: function (field) {
            this.$refs.form.$refs[field][0].focus()
        },
        select: function (field) {
            this.$refs.form.$refs[field][0].select()
        },
        getValue: function (field) {
            const data = JSON.parse(JSON.stringify(this.$refs.form.formData))
            const virtualData = JSON.parse(JSON.stringify(this.$refs.form.virtualData))
            for (let i in data) {
                if (i in virtualData) {
                    data[i] = virtualData[i]
                }
                if (data[i].constructor === Boolean) {
                    data[i] = data[i] ? 1 : 0
                }
            }
            return field && field in data ? data[field] : data
        },
        setValue: function (field, value) {
            if (field.constructor === Object) {
                for (let name in field) {
                    this.$refs.form.setValue(name, field[name] !== null && field[name] !== undefined ? field[name] : '')
                }
            } else {
                this.$refs.form.setValue(field, value !== null && value !== undefined ? value : '')
            }
        },
        setOptions: function (field, data) {
            if (field.constructor === Object) {
                for (let name in field) {
                    this.$refs.form.setOptions(name, field[name])
                }
            } else {
                this.$refs.form.setOptions(field, data)
            }
        },
        setDisabled: function (field, value = true) {
            if (field.constructor === Array) {
                for (let item of field) {
                    this.$refs.form.setDisabled(item, value)
                }
            } else {
                this.$refs.form.setDisabled(field, value)
            }
        },
        cleanForm: function (field) {
            if (field && field.constructor === Array) {
                for (let item of field) {
                    this.$refs.form.cleanForm(item)
                }
            } else {
                this.$refs.form.cleanForm(field)
            }
        },
        reset: function () {
            this.$set(this.$refs.form, 'formData', {})
            this.$refs.form.init()
        }
    },
    mounted () {
        this.$forceUpdate()
    },
    updated () {
        this.$refs.form.init()
    }
}
</script>

<style>
.eForm .el-form-item__content > div:not(.listTable, .el-form-item__error) {
    width: calc(100% - 50px);
}

.eForm .el-form-item {
    margin-bottom: 10px;
}
</style>
