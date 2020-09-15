<template>
    <div
        :class="{
            [$style.plTable]: true,
            [$style.sortable]: sortable
        }"
        :title="sortable ? '拖拽进行排序' : ''"
    >
        <el-table
            v-bind="{...$attrs, data}"
            v-on="$listeners"
            ref="table"
        >
            <slot />
            <slot name="empty" />
            <slot name="append" />
        </el-table>
    </div>
</template>

<script>
/* eslint-disable */
import Sortable from '../draggable/Sortable'
export default {
  name: 'PlTable',
  inheritAttrs: false,
  props: {
    // 是否可拖拽
    sortable: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    size () {
      return this.data.length
    }
  },
  watch: {
    size () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      if (this.sortable) {
        await this.$nextTick()
        new Sortable(this.$refs.table.$el.querySelector('tbody'), {
          group: 'shared', // set both lists to same group
          animation: 150,
          onUpdate: this.onUpdate,
          store: this.data
        });
      }
    },
    onUpdate (evt) {
      removeNode(evt.item)
      insertNode(evt.from, evt.item, evt.oldIndex)
      const { oldIndex, newIndex } = evt
      this.sortData(oldIndex, newIndex)
      this.$emit('sortUpdate', evt, this.data[newIndex])
    },
    /**
     * 调换两个元素的位置
     * @param index1 {number}
     * @param index2 {number}
     */
    async sortData (index1, index2) {
      const current = this.data.splice(index1, 1)[0]
      this.data.splice(index2, 0, current)
    }
  }
}
function removeNode (node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node)
  }
}

function insertNode (parentNode, node, position) {
  const refNode =
    position === 0
      ? parentNode.children[0]
      : parentNode.children[position - 1].nextSibling
  parentNode.insertBefore(node, refNode)
}
</script>

<style module lang="scss">
  .plTable {
    background-color: #fff;
    &.sortable {
      cursor: move;
    }
  }
</style>
