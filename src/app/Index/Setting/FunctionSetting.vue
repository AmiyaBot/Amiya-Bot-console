<template>
    <div class="functionSetting">
        <el-card class="box-card">
            <el-tabs style="height: 100%" tab-position="left">
                <el-tab-pane v-for="(title, id) in functions" :key="id">
                    <div slot="label" @click="selectSetting(id)">
                        {{ title }}
                        <span class="mark" :class="data.globalState[id] ? 'green' : 'red'"></span>
                    </div>
                    <div class="setting-body">
                        <div class="setting-head">
                            <div class="setting-title">
                                <i class="el-icon-s-tools"></i>
                                <span>{{ title }}</span>
                                <el-tooltip content="全局开关" placement="top">
                                    <el-switch v-model="data.globalState[id]"></el-switch>
                                </el-tooltip>
                            </div>
                            <div class="button-group">
                                <el-button size="mini" type="success" @click="saveSetting">保存</el-button>
                                <el-button size="mini" @click="loadSetting">重置</el-button>
                            </div>
                        </div>
                        <el-divider content-position="right">@Amiya-Bot Functions System</el-divider>
                        <div class="form">
                            <template v-if="currId in settingComps">
                                <component :is="settingComps[currId]" :data="data" @save="saveSetting"></component>
                            </template>
                            <el-empty v-else description="暂无需要设置的选项"></el-empty>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import SubSettingJade from '@/app/Index/Setting/subSetting/SubSettingJade'
import SubSettingWeibo from '@/app/Index/Setting/subSetting/SubSettingWeibo'
import SubSettingReplace from '@/app/Index/Setting/subSetting/SubSettingReplace'
import {functions, functionsSetting} from '@/define'

export default {
    name: 'FunctionSetting',
    methods: {
        loadSetting: function () {
            this.lib.requests.post({
                url: '/getFunctionSetting',
                success: res => {
                    const data = JSON.parse(JSON.stringify(functionsSetting))
                    if (res) {
                        Object.assign(data, JSON.parse(JSON.stringify(this.data)), res)
                    }
                    this.$set(this, 'data', data)
                }
            })
        },
        saveSetting: function () {
            this.lib.requests.post({
                url: '/saveFunctionSetting',
                data: this.data,
                successMessage: true,
                success: res => {
                    this.loadSetting()
                }
            })
        },
        selectSetting: function (id) {
            this.currId = id
        }
    },
    data () {
        return {
            functions: functions,
            data: functionsSetting,
            currId: null,
            settingComps: {
                weibo: SubSettingWeibo,
                jadeCalculator: SubSettingJade,
                replaceText: SubSettingReplace
            }
        }
    },
    mounted () {
        this.loadSetting()
    }
}
</script>

<style scoped>
.functionSetting,
.box-card {
    width: 100%;
    height: 100%;
}

.setting-head {
    display: flex;
    justify-content: space-between;
}

.setting-title {
    font-size: 18px;
    font-weight: bold;
    color: #5067e3;
    display: flex;
    align-items: center;
}

.setting-title > * {
    margin-right: 10px;
}

.setting-body {
    height: 100%;
    padding: 0 20px;
}

.form {
    height: calc(100% - 28px - 49px);
}

.mark {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #12ce65;
    display: inline-block;
}

.mark.red {
    background-color: #ff4949;
}
</style>
<style>
.functionSetting .el-form-item--small {
    margin: 0 !important;
}

.functionSetting .el-card__body {
    width: 100%;
    height: 100%;
}

.functionSetting .el-tabs__content {
    height: 100%;
}

.functionSetting .el-tabs__content > div {
    height: 100%;
}
</style>
