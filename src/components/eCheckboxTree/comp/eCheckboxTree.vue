<template>
    <div :style="{ height: height }">
        <el-form size="small" label-width="0">
            <el-form-item style="margin-bottom: 0">
                <el-input placeholder="输入关键字搜索" v-model="filterText"></el-input>
            </el-form-item>
        </el-form>
        <div class="treeCon">
            <el-tree ref="tree" highlight-current
                     :data="data"
                     :node-key="nodeKey"
                     :props="defaultProps"
                     :show-checkbox="checkbox"
                     :default-expand-all="expandAll"
                     :expand-on-click-node="false"
                     :filter-node-method="filterNode"
                     @node-click="nodeClick">
            </el-tree>
        </div>
    </div>
</template>

<script>
export default {
    name: 'eCheckboxTree',
    props: {
        data: Array,
        nodeKey: {
            type: String,
            default: 'id'
        },
        label: {
            type: String,
            default: 'label'
        },
        children: {
            type: String,
            default: 'children'
        },
        nodeClick: {
            type: Function,
            default: item => null
        },
        height: {
            type: String,
            default: '500px'
        },
        expandAll: {
            type: Boolean,
            default: true
        },
        checkbox: {
            type: Boolean,
            default: false
        },
        expandOnClickNode: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        filterText (value) {
            this.$refs.tree.filter(value)
        }
    },
    methods: {
        getCheckedNodes () {
            return this.$refs.tree.getCheckedNodes()
        },
        getCheckedKeys () {
            return this.$refs.tree.getCheckedKeys()
        },
        setCheckedKeys (keys) {
            this.$refs.tree.setCheckedKeys(keys)
        },
        filterNode (value, data) {
            if (!value) {
                return true
            }
            return data[this.label].indexOf(value) !== -1
        }
    },
    data () {
        return {
            defaultProps: {
                label: this.label,
                children: this.children
            },
            filterText: ''
        }
    }
}
</script>

<style scoped>
.treeCon {
    height: calc(100% - 33px);
    overflow: auto;
}
</style>
