<template>
    <div :class="$style.titleXmas">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleXmas extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-xmas {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 63px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/xmas/298790c8-dd14-40a0-b1b6-e80995652dc5.png") no-repeat center;
  background-size: 100%;
  .title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 135px;
    height: 33px;
    background: #23814D;
    border: 1.5px solid #FFFFFF;
    border-radius: 13px;
    font-size: 18px;
    font-family: Adobe Heiti Std;
    color: #FFFFFF;
    &::before {
      position: absolute;
      left: -19px;
      bottom: -3px;
      content: '';
      width: 40px;
      height: 48px;
      background: url("https://mallcdn.youpenglai.com/static/admall/skin/xmas/7393611f-65e9-4aa7-ad55-5dedc1241183.png") no-repeat center;
      background-size: 100%;
      z-index: 1;
    }
  }
}
</style>
