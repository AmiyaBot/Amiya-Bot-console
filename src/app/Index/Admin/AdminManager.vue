<template>
    <div class="admin-manager">
        <e-tabs-switcher :list="tabs"></e-tabs-switcher>
    </div>
</template>

<script>
import eTabsSwitcher from '@/components/eTabsSwitcher/eTabsSwitcher'
import AdminList from '@/app/Index/Admin/AdminList'
import AdminTraceLog from '@/app/Index/Admin/AdminTraceLog'

export default {
    name: 'AdminManager',
    components: {
        eTabsSwitcher
    },
    data () {
        return {
            tabs: [
                {name: '管理员列表', comp: AdminList},
                {name: '管理员行为记录', comp: AdminTraceLog}
            ]
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
