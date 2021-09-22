<template>
    <div class="gacha-manager">
        <e-tabs-switcher :list="tabs"></e-tabs-switcher>
    </div>
</template>

<script>
import eTabsSwitcher from '@/components/eTabsSwitcher/eTabsSwitcher'
import GachaConfig from '@/app/Index/Gacha/GachaConfig'
import GachaPool from '@/app/Index/Gacha/GachaPool'

export default {
    name: 'GachaManager',
    components: {
        eTabsSwitcher
    },
    data () {
        return {
            tabs: [
                {name: '卡池列表', comp: GachaPool},
                {name: '限定干员管理', comp: GachaConfig}
            ]
        }
    }
}
</script>

<style scoped>
.gacha-manager {
    width: 100%;
    height: 100%;
}
</style>
