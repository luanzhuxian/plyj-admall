<template>
    <ul class="sort">
        <li
            v-for="(item, i) of data"
            :key="i"
            @click="change(item, i)"
            :class="{ active: item.value === value || (item.ovonic && (value === item.ovonicValue.descending || value === item.ovonicValue.ascending)) }"
        >
            <span class="label" v-text="item.label" />
            <div class="direction">
                <i
                    v-if="item.ovonic"
                    class="icon el-icon-caret-top"
                    :style="{ color: value === item.ovonicValue.ascending? '#4F63FF' : '#666' }"
                />
                <i
                    :class="{ ovonic: item.ovonic }"
                    class="icon el-icon-caret-bottom"
                    :style="{ color: ((item.ovonic && value === item.ovonicValue.descending) || value === item.value)? '#4F63FF' : '#666' }"
                />
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Sort',
    data () {
        return {
            currentItem: '',
            descending: true // 是否降序
        }
    },
    props: {

        /*
     * [{label, value, ovonic, ovonicValue}]
     * label 排序名称
     * value 排序对应的值
     * ovonic 是否允许双向排序
     * ovonicValue 双向排序的值 { descending, ascending } descending 降序；ascending 升序
     * */
        data: {
            type: Array,
            default () {
                return [
                    {
                        ovonicValue: {}
                    }
                ]
            }
        },
        value: {
            type: String,
            default: ''
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    methods: {
        change (item) {
            if (this.currentItem !== item) {
                this.descending = true
            }
            if (this.currentItem === item && !item.ovonic) {
                return
            }
            this.currentItem = item
            if (item.ovonic) {
                if (this.descending) {
                    this.$emit('change', item.ovonicValue.descending)
                    this.descending = false
                } else {
                    this.$emit('change', item.ovonicValue.ascending)
                    this.descending = true
                }
            } else {
                this.descending = false
                this.$emit('change', item.value)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.sort {
  display: flex;
  width: max-content;
  > li {
    display: inline-flex;
    padding: 0 16px;
    border: 1px solid #e7e7e7;
    border-right: none;
    font-size: 12px;
    line-height: 28px;
    cursor: pointer;
    user-select: none;
    &:nth-last-of-type(1) {
      border-right: 1px solid #e7e7e7;
    }
    &.active {
      border-color: $--color-primary-blue;
      .label {
        color: $--color-primary-blue;
      }
      +li {
        border-left-color: $--color-primary-blue;;
      }
    }
  }
}
.direction {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin-left: 3px;
  > .icon {
      font-size: 12px;
      line-height: 12px;
    &.active {
      color: $--color-primary-blue;
    }
    &.icon-paixujiantoushang {
      margin-top: 2px;
    }
    &.icon-paixujiantouxia {
      &.ovonic {
        margin-top: 1px;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
