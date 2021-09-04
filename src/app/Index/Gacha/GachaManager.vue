<template>
    <div class="gacha-manager">
        <div>
            <el-tabs v-model="side">
                <el-tab-pane label="卡池管理" name="left"></el-tab-pane>
                <el-tab-pane label="卡池干员管理" name="right"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="container" :class="side">
            <div class="block">
                <GachaPool></GachaPool>
            </div>
            <div class="block">
                <GachaConfig></GachaConfig>
            </div>
        </div>
    </div>
</template>

<script>
import GachaConfig from '@/app/Index/Gacha/GachaConfig'
import GachaPool from '@/app/Index/Gacha/GachaPool'

export default {
    name: 'GachaManager',
    components: {
        GachaConfig,
        GachaPool
    },
    data () {
        return {
            side: 'left'
        }
    }
}
</script>

<style scoped>
.gacha-manager {
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
