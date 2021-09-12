<template>
    <div class="group-manager">
        <div>
            <el-tabs v-model="side">
                <el-tab-pane label="群组列表" name="left"></el-tab-pane>
                <el-tab-pane label="公告管理" name="right"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="container" :class="side">
            <div class="block">
                <GroupList></GroupList>
            </div>
            <div class="block">
                <GroupNotice></GroupNotice>
            </div>
        </div>
    </div>
</template>

<script>
import GroupList from '@/app/Index/Group/GroupList'
import GroupNotice from '@/app/Index/Group/GroupNotice'

export default {
    name: 'GroupManager',
    components: {
        GroupList,
        GroupNotice
    },
    data () {
        return {
            side: 'left'
        }
    }
}
</script>

<style scoped>
.group-manager {
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
