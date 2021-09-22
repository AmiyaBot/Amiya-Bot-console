<template>
    <div class="group-manager">
        <e-tabs-switcher :list="tabs"></e-tabs-switcher>
    </div>
</template>

<script>
import eTabsSwitcher from '@/components/eTabsSwitcher/eTabsSwitcher'
import GroupList from '@/app/Index/Group/GroupList'
import GroupNotice from '@/app/Index/Group/GroupNotice'

export default {
    name: 'GroupManager',
    components: {
        eTabsSwitcher
    },
    data () {
        return {
            tabs: [
                {name: '群组列表', comp: GroupList},
                {name: '公告管理', comp: GroupNotice}
            ]
        }
    }
}
</script>

<style scoped>
.group-manager {
    width: 100%;
    height: 100%;
}
</style>
