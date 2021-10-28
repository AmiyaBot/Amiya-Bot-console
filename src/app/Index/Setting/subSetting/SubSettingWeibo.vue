<template>
    <el-form size="small" label-width="120px" label-position="left">
        <el-form-item label="发送GIF">
            <el-switch v-model="data.weiboSetting.weiboSendGIF"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
        </el-form-item>
        <el-form-item label="自动推送新微博">
            <el-switch v-model="data.weiboSetting.weiboAutoPush"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
        </el-form-item>
        <el-form-item label="新微博检查频率">
            <el-input-number size="mini" v-model="data.weiboSetting.checkRate" :step="30"></el-input-number>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'SubSettingWeibo',
    props: ['data']
}
</script>

<style scoped>

</style>
