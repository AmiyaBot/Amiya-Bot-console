<template>
    <div class="searchForm" :class="uid()">
        <transition name="fade">
            <div key="1" class="form" v-show="searchOn">
                <formBuilder size="mini"
                             ref="form"
                             label-width="100px"
                             :inline="true"
                             :build-data="searchForm"
                             :display-all="false"
                             :display-filter="searchFormDisplay">
                </formBuilder>
            </div>
        </transition>
        <transition name="fade">
            <div key="2" class="searchData" v-show="!searchOn && searchOn != null">
                <el-alert title="搜索内容" type="info" :closable="false">
                    <div class="dataItem" v-for="(item, index) in searchForm" v-if="showText(item, 0)" :key="index">
                        <span>{{ item.title }}</span>
                        <span>{{ showText(item, 1) }}</span>
                        <span class="searchClose" @click="delSearch(item.field)"></span>
                    </div>
                </el-alert>
            </div>
        </transition>
    </div>
</template>

<script>
import formBuilder from '@/components/eForm/comp/formBuilder'
import $ from 'jquery'

export default {
    name: 'searchFormBuilder',
    components: {
        formBuilder
    },
    props: {
        searchForm: Array,
        searchFormDisplay: Array,
        searchOn: Boolean | null
    },
    watch: {
        searchOn: function () {
            this.calcSearchAreaHeight()
        },
        searchFormDisplay: function () {
            this.$nextTick(() => {
                this.$refs.form.init()
                this.calcSearchAreaHeight()
            })
        }
    },
    methods: {
        uid: function () {
            return 'searchFormBuilder' + this['_uid']
        },
        calcSearchAreaHeight: function () {
            setTimeout(() => {
                let elem = $('.' + this.uid() + ' ' + (this.searchOn ? '.form' : '.searchData'))
                let height = elem.height()

                this.$emit('height', height)

                $('.' + this.uid() + '.searchForm').css(
                    {
                        height: height,
                        padding: this.searchFormDisplay.length ? '5px 0 10px' : '0'
                    }
                )
            }, 0)
        },
        showText: function (item, t) {
            const formatDate = this.lib.common.formatDate
            const value = this.$refs.form.formData[item.field]
            const type = item.config.type
            const field = item.field

            if (field in this.$refs.form.formData) {
                if (t) {
                    switch (type) {
                        case 3:
                            return this.$refs.form.optionsData[field][value]
                        case 4:
                        case 41:
                            return type === 3 ? formatDate(value, 'y-m-d') : formatDate(value)
                        case 5:
                        case 51:
                            return value
                                .map(v => type === 5 ? formatDate(v, 'y-m-d') : formatDate(v))
                                .join(' 至 ')
                        default:
                            return value
                    }
                }
                switch (type) {
                    case 5:
                    case 51:
                        return !!value[0] && !!value[1]
                    default:
                        return !!value
                }
            }
            return ''
        },
        delSearch: function (field) {
            this.$refs.form.cleanForm(field)
        },
        cleanForm: function () {
            this.$refs.form.cleanForm()
            this.calcSearchAreaHeight()
        }
    }
}
</script>

<style scoped>
.searchForm {
    height: 0;
    overflow: hidden;
    position: relative;
    transition: all 300ms ease-in-out;
}

.form, .searchData {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.dataItem {
    height: 24px;
    line-height: 22px;
    margin-right: 10px;
    padding-right: 30px;
    background: #fff;
    border: 1px solid #5F75ED;
    border-radius: 4px;
    position: relative;
    float: left;
    overflow: hidden;
}

.dataItem > span:first-child {
    color: #fff;
    background: #5F75ED;
    padding: 0 10px;
    display: inline-block;
}

.dataItem > span:nth-child(2) {
    color: #000;
    padding-left: 10px;
    display: inline-block;
}

.searchClose {
    width: 20px;
    height: 100%;
    background: url(../../../assets/table/search-close.svg) center / 16px no-repeat;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
}
</style>
<style>
.searchForm .fade-enter, .searchForm .fade-leave-to {
    opacity: 0;
}

.searchForm .fade-enter-active, .searchForm .fade-leave-active {
    transition: opacity 300ms;
}

.searchForm .el-input-number--mini,
.searchForm input {
    width: 200px;
}
</style>
