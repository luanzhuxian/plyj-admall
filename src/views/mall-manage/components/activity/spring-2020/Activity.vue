<template>
    <div :class="$style.activity">
        <div
            :class="[$style.item, $style.large]"
            :style="{
                background,
                boxShadow
            }"
        >
            <div :class="$style.info">
                <div :class="$style.sub">
                    翻开记忆的味道
                </div>
                <PlSvg name="icon-nianwei" width="132" height="27" />
                <div :class="$style.btn">
                    立即参加
                </div>
            </div>
            <div :class="$style.imgWrapper">
                <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/61795ee4-ca67-49c5-b5c2-d3f8769e98dc.png" alt="">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Activity extends Vue {
    /* props */
    @Prop({
        type: String,
        default: '#FFF'
    }) readonly background!: string

    @Prop(String) boxShadow!: string
}
</script>

<style lang="scss" module>
  .activity {
    display: flex;
    justify-content: space-between;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .item {
    box-sizing: border-box;
    border-radius: 10px;
    &.large {
      &.item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 35px 20px 22px;
        width: 100%;
        height: 134px;
      }
      .img-wrapper {
        width: 88px;
        height: 88px;
        overflow: hidden;
      }
      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .sub {
        margin-bottom: 4px;
        font-size: 12px;
        font-family: PingFang SC;
        color: #B48A64;
      }
      .btn {
        position: relative;
        margin-top: 14px;
        width: 116px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: linear-gradient(180deg, #FB873A 0%, #F64C1B 100%);
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        color: #FFFFFF;
        &:after {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          content: '';
          width: 0;
          height: 0;
          border-width: 5px;
          border-color: transparent transparent transparent #FFFFFF;
          border-style: solid;
          border-radius: 2px;
        }
      }
    }
  }
</style>
