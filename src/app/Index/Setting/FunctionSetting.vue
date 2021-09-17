<template>
    <div class="functionSetting">
        <el-card class="box-card">
            <div class="button-group">
                <el-button type="success" @click="saveSetting">保存</el-button>
                <el-button @click="loadSetting">重置</el-button>
            </div>
            <div class="setting-content">
                <el-tabs tab-position="left">
                    <el-tab-pane v-for="(title, id) in functions" :key="id">
                        <div slot="label">
                            {{ title }}
                            <span class="mark" :class="data.globalState[id] ? 'green' : 'red'"></span>
                        </div>
                        <el-card>
                            <div slot="header">
                                <i class="el-icon-share"></i>
                                <span>{{ title }}设置</span>
                            </div>
                            <el-form class="form" size="small" label-width="120px" label-position="left">
                                <el-divider content-position="left">全局选项</el-divider>
                                <el-form-item label="启用">
                                    <el-switch v-model="data.globalState[id]"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949">
                                    </el-switch>
                                </el-form-item>
                                <el-divider content-position="left">子选项</el-divider>
                                <SubSettingJade :data="data" v-if="id === 'jadeCalculator'"></SubSettingJade>
                                <SubSettingWeibo :data="data" v-if="id === 'weibo'"></SubSettingWeibo>
                            </el-form>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
</template>

<script>
import SubSettingJade from '@/app/Index/Setting/SubSettingJade'
import SubSettingWeibo from '@/app/Index/Setting/SubSettingWeibo'
import {functions, functionsSetting} from '@/define'

export default {
    name: 'FunctionSetting',
    components: {
        SubSettingJade,
        SubSettingWeibo
    },
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
        }
    },
    data () {
        return {
            functions: functions,
            data: functionsSetting
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

.button-group {
    margin-bottom: 20px;
}

.setting-content {
    height: calc(100% - 60px);
    overflow: auto;
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

.form {
    width: 500px;
}
</style>
<style>
.functionSetting .el-form-item--small {
    margin: 0;
}

.functionSetting .el-card__body {
    width: 100%;
    height: 100%;
}
</style>
