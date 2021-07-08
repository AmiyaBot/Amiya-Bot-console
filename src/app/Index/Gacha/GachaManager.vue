<template>
    <div class="gacha-manager">
        <div class="container" :class="side">
            <div class="block">
                <GachaPool></GachaPool>
            </div>
            <div class="side to-right" @click="toggle"></div>
            <div class="side to-left" @click="toggle"></div>
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
    methods: {
        toggle: function () {
            this.side = this.side === 'left' ? 'right' : 'left'
        }
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
    width: 200%;
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
    width: calc(50% - 80px);
    height: 100%;
}

.side {
    width: 70px;
    height: 100%;
    margin: 0 5px;
    border-radius: 10px;
    background-size: 30px;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
}

.side:hover {
    transition: all 300ms linear;
    background-color: rgba(95, 117, 236, 0.1);
}

.side.to-right {
    background-image: url(../../../assets/icon/arrow-double-right.svg);
}

.side.to-left {
    background-image: url(../../../assets/icon/arrow-double-left.svg);
}
</style>
