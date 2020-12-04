<template>
    <PlMask
        :show="show"
        @close="closeHandler"
    >
        <div class="phone">
            <div class="box" title="滚动转轮，上下滚动">
                <div v-if="top" class="top" />
                <slot />
            </div>
        </div>
    </PlMask>
</template>

<script>
import PlMask from './PlMask.vue'
export default {
    components: {
        PlMask
    },
    props: {
        show: Boolean,
        top: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        closeHandler () {
            this.$emit('update:show', false)
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.phone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 17px 24px 24px 24px;
  background:url('https://mallcdn.youpenglai.com/static/admall-new/base/phone.png') 0 0 no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  .box {
    position: relative;
    overflow: scroll;
    width: 300px;
    height: 662px;
      border-radius: 35px;
    &::-webkit-scrollbar {
      display: none;
    }
    .top {
      width: 100%;
      height: 18px;
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/phone-top.png") no-repeat center top;
      background-size: 100% 100%;
    }
  }
}
</style>
