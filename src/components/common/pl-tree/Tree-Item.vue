<template>
    <div
        v-if="!hiddenTruth"
        :class="{
            'pl-tree-item': true,
            'is-child': isChild,
            'is-collapse': !isExpanded
        }"
        :style="`--lineHeight: ${lineHeight}px; --fontSize: ${fontSize}px;`"
        ref="treeItem"
        @click.stop="e => { clickHandler(e, nodeData) }"
    >
        <div
            class="pl-tree-content"
            :data-index="index"
        >
            <!--<pl-svg
                class="pl-tree-content-on-off"
                v-if="!isExpanded && !isChild && nodeData[options.children] && nodeData[options.children].length > 0"
                name="icon-expand"
                @click.stop="expand"
                width="25"
                height="18"
            />-->
            <i
                v-if="!isChild && allowExpand"
                class="el-icon-caret-right icon-arrow"
                :class="{ 'is-expanded': isExpanded }"
                @click.stop="!isExpanded ? expand() : collapse()"
            />
            <!--<pl-svg
                class="pl-tree-content-on-off"
                v-else-if="!isChild && nodeData[options.children] && nodeData[options.children].length > 0"
                name="icon-collapse"
                @click.stop="collapse"
                width="25"
                height="18"
            />-->
            <!--<pl-svg
                v-show="(nodeData[options.children] || !isChild) && isExpanded"
                class="icon mr-10"
                width="25"
                height="18"
                name="icon-dir-open"
                :style="{'margin-left': (nodeData[options.children] && nodeData[options.children].length > 0)? 0 : 33}"
            />-->
            <!--<pl-svg
                v-show="(nodeData[options.children] && nodeData[options.children].length || !isChild) && !isExpanded"
                class="icon mr-10"
                width="25"
                height="18"
                name="icon-dir-close"
                :style="{'margin-left': (nodeData[options.children] && nodeData[options.children].length > 0)? 0 : 33}"
            />-->
            <span
                v-if="nodeData[options.label]"
                class="pl-tree-item-label"
                v-text="nodeData[options.label]"
            />
            <!-- 使用自定义label -->
            <span
                v-else
                class="pl-tree-item-label"
            >
                <slot
                    name="treeItemLabel"
                    :data="nodeData"
                />
            </span>
            <!-- 为label添加额外的内容 -->
            <div class="pl-tree-content-custom">
                <slot :data="nodeData" />
            </div>
        </div>
        <transition name="collapse">
            <Draggable
                v-if="nodeData[options.children] && nodeData[options.children].length > 0"
                ref="itemWrap"
                class="pl-tree-children"
                tag="div"
                :list="nodeData[options.children]"
                animation="200"
                ghost-class="ghost"
                @change="change"
                :style="{ '--childHeight': childHeight + 'px' }"
                v-show="isExpanded"
            >
                <template v-for="(item, i) of nodeData[options.children]">
                    <TreeItem
                        v-if="hidden.indexOf(item[options.label]) === -1"
                        :index="`${index}-${i}`"
                        :options="options"
                        :node-data="item"
                        :key="item.id"
                        :is-child="true"
                        :hidden="hidden"
                        @change="change"
                        :draggable="draggable"
                        @click.stop="e => { clickHandler(e, item) }"
                    >
                        <template
                            slot="treeItemLabel"
                            slot-scope="{ data }"
                        >
                            <slot
                                name="treeItemLabel"
                                :data="data"
                            />
                        </template>
                        <template slot-scope="{ data }">
                            <slot :data="data" />
                        </template>
                    </TreeItem>
                </template>
            </Draggable>
        </transition>
    </div>
</template>

<script>
import Draggable from '../draggable'

export default {
    name: 'TreeItem',
    components: {
        Draggable
    },
    data () {
        return {
            isExpanded: false,
            childHeight: 0,
            dragStart: false
        }
    },
    props: {
        draggable: {
            type: Boolean,
            default: true
        },
        // 是否允许展开
        allowExpand: {
            type: Boolean,
            default: true
        },
        // 配置字段名称
        options: {
            type: Object,
            required: true,
            default () {
                return {
                    label: 'label',
                    value: 'value',
                    children: 'children'
                }
            }
        },
        // 每一级的数据
        nodeData: {
            type: Object,
            required: true,
            default () {
                return {
                    label: '',
                    value: '',
                    children: null
                }
            }
        },
        index: {
            type: [Number, String],
            default: 0
        },
        // 是否为子级
        isChild: {
            type: Boolean,
            default: false
        },
        // 文本行高 px
        lineHeight: {
            type: Number,
            default: 34
        },
        // 文本字体大小 px
        fontSize: {
            type: Number,
            default: 14
        },
        // 要隐藏的label
        hidden: {
            type: Array,
            default () {
                return []
            }
        }
    },
    created () {
        // 已展开的孩子数量，用来计算折叠高度，以便开关正确过度
        this.childCountOpened = 0
    },
    computed: {
        hiddenTruth () {
            const nodeData = this.nodeData
            for (const h of this.hidden) {
                for (const k of Object.keys(nodeData)) {
                    if (nodeData[k] === h) {
                        return true
                    }
                }
            }
            return false
        }
    },
    methods: {
        // 计算item的高度，计算过程中要考虑孩子是否展开，如果没有展开，孩子数+1，如果展开了，递归
        getChildHeight (children) {
            if (!children) {
                return
            }
            const child = Array.from(children.childNodes)
            for (const c of child) {
                if (c.classList.contains('is-collapse')) {
                    this.childCountOpened++
                } else {
                    this.childCountOpened++
                    this.getChildHeight(c.querySelector('.pl-tree-children'))
                }
            }
        },
        expand () {
            const treeItem = this.$refs.treeItem
            if (treeItem) {
                this.childCountOpened = 0
                this.getChildHeight(treeItem.querySelector('.pl-tree-children'))
                this.childHeight = this.childCountOpened * this.lineHeight
                this.isExpanded = true
            }
        },
        collapse () {
            // 关闭前重新计算高度
            // 因为关闭时和展开时，孩子的总展开数可能不同
            const treeItem = this.$refs.treeItem
            if (treeItem) {
                this.childCountOpened = 0
                this.getChildHeight(treeItem.querySelector('.pl-tree-children'))
                this.childHeight = this.childCountOpened * this.lineHeight
                this.isExpanded = false
            }
        },
        clickHandler (e, nodeData) {
            const nodeList = document.querySelectorAll('.tree-node-active')
            for (const n of nodeList) {
                n.classList.remove('tree-node-active')
            }
            e.currentTarget.classList.add('tree-node-active')
            e.nodeData = nodeData
            this.$emit('click', e)
            this.$emit('node-click', nodeData)
        },

        /**
             * 拖拽结束事件
             * @param e {Object} 当前拖动的元素
             */
        change (e) {
            this.$emit('change', e, this.nodeData[this.options.children])
        }
    }
}
</script>

<style scoped lang="scss">
    .pl-tree-item {
        position: relative;
        cursor: move;

        &.tree-node-active {
            background-color: #eee;

            .pl-tree-content:hover {
                background-color: inherit;
            }
        }

        &.is-child {
            padding-left: 0;
            .pl-tree-content {
                padding-left: 34px;
            }
        }

        /*&:before {
          position: absolute;
          content: '';
          left: 50px;
          top: 34px;
          width: 1px;
          height: calc(100% - 60px); !* 减去行高，和图标距离底部的距离 *!
          background-color: #ccc;
          z-index: 1;
        }
        &.is-child:after {
          position: absolute;
          content: '';
          left: -14px;
          top: 24px;
          width: 24px;
          height: 1px;
          background-color: #ccc;
        }*/
        .icon-arrow {
            padding: 6px;
            margin-bottom: 0;
            transition: transform .2s;
            color: #333;
            cursor: pointer;

            &.is-expanded {
                transform: rotate(90deg);
            }
        }

        .pl-tree-item-label {
            line-height: var(--lineHeight);
            font-size: var(--fontSize);;
            user-select: none;
        }

        .pl-tree-content {
            position: relative;
            display: flex;
            align-items: center;
            padding-left: 8px;
            max-height: var(--lineHeight);
            transition: box-shadow .2s linear, transform .2s linear;

            &:hover {
                background-color: #fbfbfb;

                .pl-tree-content-custom {
                    display: block;
                }
            }

            .pl-tree-content-custom {
                display: none;
            }

            .pl-tree-content-on-off {
                margin-right: 8px;
                font-size: 16px;
                width: 16px;
                height: 24px;
                line-height: 24px;
                color: #ccc;
            }

            .pl-tree-content-icon {
                font-size: 20px;
                margin-right: 8px;
                color: #28CAFF;
            }
        }

        .pl-tree-children {
            position: relative;
            /*padding-left: 26px;*/
            overflow: hidden;

            .pl-tree-item-label {
                color: #666;
            }
        }
    }

    .collapse-enter, .collapse-leave-to {
        height: 0;
    }

    .collapse-enter-active {
        transition: height .3s ease-in;
    }

    .collapse-leave-active {
        transition: height .3s ease-out;
    }

    .collapse-leave, .collapse-enter-to {
        height: var(--childHeight);
    }
</style>
<style>
    .pl-tree-nonius {
        position: fixed;
        top: 0;
        height: 2px;
        background-color: #007AFF;
    }
</style>
