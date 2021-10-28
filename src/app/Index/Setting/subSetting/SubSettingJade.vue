<template>
    <el-form size="small" label-width="120px" label-position="left">
        <el-form-item label="月卡登录获得">
            <el-input-number size="mini" v-model="data.jadeSetting.signIn"></el-input-number>
        </el-form-item>
        <el-form-item label="每日任务获得">
            <el-input-number size="mini" v-model="data.jadeSetting.dailyTasks"></el-input-number>
        </el-form-item>
        <el-form-item label="每周任务获得">
            <el-input-number size="mini" v-model="data.jadeSetting.weeklyTasks"></el-input-number>
        </el-form-item>
        <el-form-item label="每日剿灭获得">
            <el-input-number size="mini" v-model="data.jadeSetting.weeklyBattle"></el-input-number>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'SubSettingJade',
    props: ['data']
}
</script>

<style scoped>

</style>
