<template>
    <div class="tree-selector">
        <el-popover placement="bottom"
                    trigger="manual"
                    v-model="visible">

            <div slot="reference">
                <slot :show="show"></slot>
            </div>
            <div class="tree-content" :class="uid()" :style="{ minWidth: minWidth + 'px' }">
                <e-checkbox-tree :data="treeData"
                                 :node-key="tree.id"
                                 :label="tree.label"
                                 :children="tree.children"
                                 :node-click="nodeSelected"
                                 :expand-on-click-node="false"
                                 :checkbox="false"></e-checkbox-tree>
            </div>
        </el-popover>
    </div>
</template>

<script>
import treeSelectorProps from '@/components/eForm/js/treeSelectorProps'
import eCheckboxTree from '@/components/eCheckboxTree/comp/eCheckboxTree'
import $ from 'jquery'

export default {
    name: 'treeSelector',
    props: treeSelectorProps,
    components: {
        eCheckboxTree
    },
    watch: {
        status: {
            handler: function (status) {
                this.visible = status.onFocus || status.onHover
            },
            deep: true
        },
        dataList: {
            handler: function (data) {
                this.$emit('dataChange', data)
            },
            deep: true
        }
    },
    methods: {
        uid: function () {
            return 'treeSelector' + this['_uid']
        },
        show: function (status = true, $event) {
            this.minWidth = $event.target.clientWidth
            this.status.onFocus = status
        },
        nodeSelected: function (item) {
            if (item) {
                if (this.field in item) {
                    const value = item[this.virtual && 'value' in this.virtual ? this.virtual.value : this.field]
                    const show = item[this.virtual && 'show' in this.virtual ? this.virtual.show : this.field]

                    this.bind[this.field] = show || value
                    this.setVirtual(this.field, value)
                }
                if (this.selected) {
                    this.selected(JSON.parse(JSON.stringify(item)))
                }
            }
            this.status.onHover = false
        }
    },
    data () {
        return {
            visible: false,
            status: {
                onFocus: false,
                onHover: false
            },
            minWidth: 0
        }
    },
    mounted () {
        $(`.${this.uid()}`).off('mouseenter mouseleave').on({
            mouseenter: () => this.status.onHover = true,
            mouseleave: () => this.status.onHover = false
        })
    }
}
</script>

<style scoped>

</style>
