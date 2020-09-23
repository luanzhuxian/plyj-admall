<template>
    <div :class="$style.titleYuanDan">
        <div
            :class="$style.characterWrapper"
            :style="{ '--length': data.length || 0 }"
        >
            <span :class="$style.characterBg" v-for="(item, index) of data" :key="index">
                {{ item }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleYuanDan extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-yuan-dan {
  position: relative;
  height: 83px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/08048559-9ce4-404c-a2dc-48d5af1c06ed.png") no-repeat center bottom;
  background-size: 309px auto;
  .character-wrapper {
    position: absolute;
    top: 18px;
    left: calc(110px + ((4 - var(--length)) * 19px));
    height: 53px;
  }
  .character-bg {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 53px;
    height: 53px;
    line-height: 47px;
    text-align: center;
    background: #D41C18;
    border: 2px solid rgba(233,151,47,1);
    border-radius: 50%;
    font-size: 28px;
    color: #FFFFFF;
    @for $i from 1 through 5 {
      $gap : 38px;
      &:nth-of-type(#{$i}) {
        left: ($i - 1) * $gap;
        z-index: $i;
      }
    }
  }
}
</style>
