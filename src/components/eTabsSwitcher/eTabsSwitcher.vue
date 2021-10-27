<template>
    <div class="tabs">
        <el-tabs v-if="list.length" v-model="tabIndex">
            <el-tab-pane v-for="(item, index) in list"
                         :label="item.name"
                         :name="index.toString()"
                         :key="index"></el-tab-pane>
        </el-tabs>
        <div class="container" :style="translate()">
            <div class="block" v-for="(item, index) in list" v-if="openedIndexes.indexOf(index) >= 0"
                 :style="{ width: 100 / list.length + '%' }"
                 :key="index">
                <component class="shadow-box" :is="item.comp"></component>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'eTabsSwitcher',
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    watch: {
        tabIndex: function (index) {
            index = parseInt(index)
            setTimeout(() => {
                if (this.openedIndexes.indexOf(index) < 0) {
                    this.openedIndexes.push(index)
                }
            }, index === 0 ? 0 : 500)
        }
    },
    methods: {
        translate: function () {
            return {
                width: `calc(${100 * this.list.length}% + 60px)`,
                transform: `translateX(-${this.tabIndex * (100 / this.list.length)}%)`
            }
        }
    },
    data () {
        return {
            tabIndex: null,
            openedIndexes: []
        }
    }
}
</script>

<style scoped>
.tabs {
    width: 100%;
    height: 100%;
}

.container {
    height: 100%;
    transition: all 500ms ease-in-out;
    display: flex;
}

.block {
    padding-right: 30px;
    height: calc(100% - 54px);
    overflow: auto;
}
</style>
