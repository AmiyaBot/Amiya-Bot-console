<template>
    <el-dialog :title="title"
               :width="width || '700px'"
               :visible.sync="visible"
               :fullscreen="fullscreen"
               :append-to-body="appendToBody"
               :center="true"
               :show-close="true"
               :before-close="beforeClose"
               :close-on-click-modal="shadeClose"
               :custom-class="['custom-window', uid()].join(' ')">
        <template v-if="type === 'form'">
            <el-form label-width="120px" size="small" style="overflow: hidden;">
                <slot></slot>
            </el-form>
            <div slot="footer">
                <slot name="button">
                    <el-button @click="hide">取消</el-button>
                    <el-button type="primary" @click="submitAction">确定</el-button>
                </slot>
            </div>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </el-dialog>
</template>

<script>
import eventBus from '@/components/eTable/js/eventBus'
import $ from 'jquery'

export default {
    name: 'eWindow',
    props: {
        windowId: String,
        title: String,
        width: String,
        type: String,
        submit: Function,
        onClose: Function,
        beforeClose: Function,
        fullscreen: Boolean,
        appendToBody: {
            type: Boolean,
            default: true
        },
        enableDrag: {
            type: Boolean,
            default: false
        },
        shadeClose: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        visible: function (value) {
            if (!value && this.onClose) {
                this.onClose(this.windowId || this.uid())
            }
            if (value && this.drag) {
                const className = `.${this.uid()} .el-dialog__header`
                this.$nextTick(() => {
                    $(className).off().on({
                        mousedown: () => {
                            $(className).on('mousemove', e => {
                                this.positions.x += e.originalEvent.movementX
                                this.positions.y += e.originalEvent.movementY
                            })
                        },
                        mouseup: () => {
                            $(className).off('mousemove')
                        }
                    })
                })
            }
            if (!this.top && this.topParents) {
                this.$nextTick(() => {
                    eventBus.$emit('windowBus' + this.topParents, {
                        uid: this.uid(),
                        status: value
                    })
                })
            }
        },
        positions: {
            handler: function () {
                $(`.${this.uid()}`).css({
                    top: this.positions.y,
                    left: this.positions.x
                })
            },
            deep: true
        }
    },
    methods: {
        uid: function () {
            return 'Window' + this['_uid']
        },
        show: function () {
            this.visible = true
        },
        hide: function () {
            this.visible = false
        },
        submitAction: function () {
            if (this.submit) {
                this.submit()
            } else {
                this.hide()
            }
        },
        foundParents: function (vm = this, parents = []) {
            if (vm.$parent !== undefined) {
                if (vm.$parent.$options.name === 'eWindow') {
                    parents.unshift(vm.$parent.uid())
                }
                return this.foundParents(vm.$parent, parents)
            }
            return parents
        }
    },
    data () {
        return {
            top: false,
            topParents: null,
            visible: false,
            drag: false,
            children: [],
            positions: {
                x: 0,
                y: 0
            }
        }
    },
    mounted () {
        const parents = this.foundParents()

        this.drag = parents.length ? false : (this.enableDrag && !this.fullscreen)
        this.topParents = parents.length ? parents[0] : null

        /**
         * 检查自身是否为最上级，若是则拥有操作所有下级的权限
         * @type {boolean}
         */
        this.top = !parents.length
        if (this.top) {
            this.children.push(this.uid())

            eventBus.$on('windowBus' + this.uid(), item => {
                const children = this.children
                const index = children.indexOf(item.uid)

                if (item.status) {
                    children.push(item.uid)
                } else {
                    children.splice(index, 1)
                }

                let reverse = JSON.parse(JSON.stringify(children)).reverse()
                let totalX = 0

                for (let i in reverse) {
                    const winEl = $('.custom-window.' + reverse[i])
                    const winParEl = $('.custom-window.' + reverse[parseInt(i) - 1])

                    const calcX = winParEl.length ? (winParEl.width() - winEl.width()) / 2 : 0
                    const position = winEl.width() + calcX + totalX + 20

                    winEl.css({
                        transform: `translateX(-${i > 0 ? position : 0}px)`,
                        transition: `transform 400ms ease-in-out`
                    })

                    totalX += i > 0 ? position : 0
                }
            })
        }
    }
}
</script>

<style src="../css/eWindow.css"></style>
