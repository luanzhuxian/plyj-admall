<template>
    <div :class="$style.titleNewYear">
        <span :class="$style.characterBg" v-for="(item, index) of data" :key="index">
            {{ item }}
        </span>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleNewYear extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-new-year {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 63px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/new-year/82d14077-5842-4214-9ad4-b77f3a23818c.png") no-repeat center;
  background-size: 100%;
  .character-bg {
    position: relative;
    top: 2px;
    width: 39px;
    height: 40px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/new-year/bc5fc36f-7f23-4be7-85cb-d7db6e410a4a.png") no-repeat center;
    background-size: 100%;
    margin: 0 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 21px;
    font-family: FZQKBYSJW;
    color: #C1181F;
  }
}
</style>
