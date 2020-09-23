<template>
    <div :class="[$style.titleYuanXiao, data.length > 2 ? $style.large : $style.small]">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleYuanXiao extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-yuan-xiao {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/bbeede14-32d5-49f8-b2d0-87c545216143.png") no-repeat center;
  background-size: 100%;
  &.large > .title {
    width: 235px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/aea27816-d663-45eb-bc52-7fb90be39070.png") no-repeat center;
    background-size: 100%;
  }
  &.small > .title {
    width: 191px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/82c660db-2fc7-4592-911e-310f39ae31a5.png") no-repeat center;
    background-size: 100%;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 55px;
    font-size: 26px;
    font-family: FZQingKeBenYueSongS-R-GB;
    color: #F75519;
    letter-spacing: 4px;
  }
}
</style>
