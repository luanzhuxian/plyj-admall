<template>
    <div :class="$style.titleCampaign">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TitleCampaign extends Vue {
    @Prop(String) data!: string
}
</script>

<style lang="scss" module>
.title-campaign {
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    background: linear-gradient(0deg,#0B97FF 0%,#57A1FF 100%);
    font-size: 18px;
    font-family: HYLiLiangHeiJ;
    color: #FFF;
    text-shadow: 0px 1.5px 2px rgba(17,17,17,0.41);
    letter-spacing: 4px;
  }
}
</style>
