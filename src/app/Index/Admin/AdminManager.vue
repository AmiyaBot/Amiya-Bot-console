<template>
    <div class="admin-manager">
        <div>
            <el-tabs v-model="side">
                <el-tab-pane label="管理员列表" name="left"></el-tab-pane>
                <el-tab-pane label="管理员行为记录" name="right"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="container" :class="side">
            <div class="block">
                <AdminList></AdminList>
            </div>
            <div class="block">
                <AdminTraceLog></AdminTraceLog>
            </div>
        </div>
    </div>
</template>

<script>
import AdminList from '@/app/Index/Admin/AdminList'
import AdminTraceLog from '@/app/Index/Admin/AdminTraceLog'

export default {
    name: 'AdminManager',
    components: {
        AdminList,
        AdminTraceLog
    },
    data () {
        return {
            side: 'left'
        }
    }
}
</script>

<style scoped>
.admin-manager {
    width: 100%;
    height: 100%;
}

.container {
    width: calc(200% + 60px);
    height: 100%;
    transition: all 500ms ease-in-out;
    display: flex;
}

.container.left {
    transform: translateX(0);
}

.container.right {
    transform: translateX(-50%);
}

.block {
    width: 50%;
    padding-right: 30px;
    height: calc(100% - 54px);
    overflow: auto;
}
</style>
