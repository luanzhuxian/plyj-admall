<template>
    <div :class="$style.titleWomenDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleWomenDay extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-women-day {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 72px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/women-day/title.png") no-repeat center bottom;
  background-size: 285px auto;
  .title {
    margin-bottom: 9px;
    max-width: 155px;
    line-height: 34px;
    text-align: center;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFEEE5;
  }
}
</style>
