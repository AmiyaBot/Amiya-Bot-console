<template>
    <div class="eForm">
        <formBuilder ref="form"
                     :size="size"
                     :inline="inline"
                     :label-width="labelWidth"
                     :build-data="buildData"
                     :display-filter="displayFilter"
                     :display-all="displayAll"
                     :before-submit="beforeSubmit"
                     :onchange="onchange"></formBuilder>
        <el-form class="formBuilder">
            <slot name="item"></slot>
            <el-form-item :label="' '"
                          :label-width="labelWidth">
                <div>
                    <slot></slot>
                </div>
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
.eForm .el-form-item__content > div:not(.listTable) {
    width: 380px;
}
</style>
