<template>
    <div class="sourceManager">
        <el-card class="box-card">
            <el-descriptions title="重要资源" :column="2" size="mini" border>
                <el-descriptions-item label="游戏数据">
                    <div v-html="data['gameData']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="样式文件">
                    <div v-html="data['style']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="数据库文件">
                    <div v-html="data['database']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="前端文件">
                    <div v-html="data['console']"></div>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
        <el-card class="box-card">
            <el-descriptions title="抽卡资源" :column="2" size="mini" border>
                <el-descriptions-item label="职业图标">
                    <div v-html="data['class']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="十连背景图片">
                    <div v-html="data['gacha']"></div>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
        <el-card class="box-card">
            <el-descriptions title="游戏静态资源" :column="2" size="mini" border>
                <template slot="extra">
                    <el-button class="el-icon-refresh" type="text" size="medium" @click="refresh">刷新资源</el-button>
                </template>
                <el-descriptions-item label="阿米娅语音">
                    <div v-html="data['AmiyaVoices']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="干员头像">
                    <div v-html="data['avatars']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="干员半身照">
                    <div v-html="data['portraits']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="技能图标">
                    <div v-html="data['skills']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="材料图标">
                    <div v-html="data['materials']"></div>
                </el-descriptions-item>
                <el-descriptions-item label="敌人头像">
                    <div v-html="data['enemies']"></div>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>
</template>

<script>

export default {
    name: 'SourceManager',
    methods: {
        getData: function () {
            this.lib.requests.post({
                url: '/getSourceDownloadState',
                success: res => {
                    const html = {}
                    for (let name in res) {
                        const num = res[name].split('/')
                        const color = num[0] !== num[1] ? 'red' : ''
                        html[name] = `<span style="color: ${color}">${num[0]}</span> / <span>${num[1]}</span>`
                    }
                    this.$set(this, 'data', html)
                }
            })
        },
        refresh: function () {
            this.lib.message.confirm('刷新资源会开始下载缺失的资源，将耗费一定时间，请耐心等待', '注意', () => {
                this.lib.requests.post({
                    url: '/refreshSource'
                })
            })
        }
    },
    data () {
        return {
            data: {}
        }
    },
    mounted () {
        this.getData()
    }
}
</script>

<style scoped>
.sourceManager {
    display: flex;
    flex-wrap: wrap;
}

.box-card {
    width: 500px;
    margin: 5px;
}
</style>
