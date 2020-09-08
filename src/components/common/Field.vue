<template>
    <div
        :class="'field ' + size"
        :style="{
            marginBottom: mb + 'px'
        }"
    >
        <span
            :style="{
                width: titleWidth,
                color: titleColor
            }"
            class="title"
            v-text="title"
        />
        <span
            :style="{
                color: textColor,
                ...textStyle
            }"
            class="text"
            v-text="text"
        />
    </div>
</template>

<script>
export default {
    name: 'Field',
    props: {
        title: {
            type: String,
            default: ''
        },
        text: {
            type: [String, Number, Boolean],
            default: ''
        },
        titleStyle: {
            type: Object,
            default () {
                return {}
            }
        },
        titleWidth: {
            type: String,
            default: 'auto'
        },
        textStyle: {
            type: Object,
            default () {
                return {}
            }
        },
        size: {
            type: String,
            default: 'middle'
        },
        mb: {
            type: Number,
            default: 16
        },
        titleColor: {
            type: String,
            default: '#333'
        },
        textColor: {
            type: String,
            default: '#333'
        }
    }
}
</script>

<style scoped lang="scss">
  .field {
    display: flex;
    flex-wrap: nowrap;
    &.middle {
      font-size: 16px;
    }
    &.small {
      font-size: 14px;
    }
    .title {
      display: inline-block;
      margin-right: 10px;
      line-height: 22px;
      white-space: nowrap;
    }
    .text {
      display: inline-block;
      line-height: 22px;
    }
    &:nth-last-of-type(1) {
      margin-bottom: 0 !important;
    }
  }
</style>
