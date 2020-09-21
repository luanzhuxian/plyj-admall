<template>
    <Draggable
        ref="itemWrap"
        class="pl-tree"
        tag="div"
        :list="tree"
        animation="200"
        ghost-class="ghost"
        @change="rootChange"
        :disabled="disabled"
    >
        <TreeItem
            v-for="(item, index) of tree"
            :index="index"
            :options="options"
            :node-data="item"
            :key="item.id"
            :hidden="hidden"
            @node-click="clickHandler"
            @change="change"
            ref="treeItem"
            :allow-expand="allowExpand"
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
    </Draggable>
</template>

<script>
import TreeItem from './Tree-Item.vue'
import Draggable from '../draggable'
export default {
    name: 'Tree',
    components: {
        TreeItem,
        Draggable
    },
    data () {
        return {
            isExpand: false
        }
    },
    props: {
        tree: {
            type: Array,
            default () {
                return []
            }
        },
        // 是否允许展开
        allowExpand: {
            type: Boolean,
            default: true
        },
        // 禁用父级拖拽
        disabled: Boolean,
        // 自定义属性选项
        options: {
            type: Object,
            default () {
                return {
                    label: 'label',
                    value: 'value',
                    sort: 'sort',
                    children: 'children'
                }
            }
        },
        // 要隐藏的label
        hidden: {
            type: Array,
            default () {
                return []
            }
        }
    },
    methods: {

        /**
     * 拖拽结束事件
     * @param e {Object} 当前拖动的元素
     * @param list {Array} 当前元素所在的列表
     */
        change (e, list) {
            this.$emit('change', e, list)
        },
        rootChange (e) {
            this.$emit('change', e, this.tree)
        },
        clickHandler (data) {
            this.$emit('node-click', data)
        },
        expandOfCollapse () {
            if (this.isExpand) {
                for (const cVm of this.$refs.treeItem) {
                    cVm.collapse()
                }
                this.isExpand = false
            } else {
                for (const cVm of this.$refs.treeItem) {
                    cVm.expand()
                }
                this.isExpand = true
            }
        }
    }
}
</script>

<style lang="scss">
  .pl-tree {
    position: relative;
    display: flex;
    flex-direction: column;
    .drag-over-front, .drag-over-back {
      position: absolute;
      display: none;
    }
    .drag-over-front, .drag-over-back {
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #007AFF;
      box-sizing: content-box;
      background-clip: content-box;
      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: inherit;
        z-index: 2;
      }
    }
    .drag-over-front {
      top: 0;
    }
    .drag-over-back {
      bottom: 4px;
    }
  }
</style>
