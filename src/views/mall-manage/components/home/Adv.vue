<template>
    <div :class="$style.adv">
        <img
            v-imgError
            v-if="data.values[0] && data.values[0].image"
            :src="data.values[0].image"
            width="100%"
            height="100%"
        >
        <img
            v-imgError
            v-else
            src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/basic/mod-b.png"
            width="100%"
            height="100%"
        >
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'

@Component
export default class Adv extends Vue {
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule
}
</script>

<style module lang="scss">
  .adv {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    text-align: center;
    background: #FFF;
    border-radius: 10px;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
