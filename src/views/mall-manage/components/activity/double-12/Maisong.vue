<template>
    <div :class="$style.maisong">
        <div :class="$style.background" />
        <div :class="$style.inner">
            <div :class="$style.maisongTitle" v-if="data.otherValue">
                {{ data.otherValue }}
            </div>
            <ul :class="$style.maisongList" v-if="data.values.length">
                <li
                    :class="{
                        [$style.maisongListItem]: true,
                        [$style.small]: data.values.length === 3,
                        [$style.middle]: data.values.length === 2,
                        [$style.large]: data.values.length === 1
                    }"
                    v-for="(item, i) of data.values"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img v-imgError :src="item.image ? item.image : 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/class/mod-popular-3.jpg'">
                    </div>
                    <div :class="$style.info">
                        <PlSvg width="16" name="icon-gift-1" v-if="i === 0" />
                        <PlSvg width="16" name="icon-gift-2" v-if="i === 1" />
                        <PlSvg width="16" name="icon-gift-3" v-if="i === 2" />
                        <div :class="$style.sub">
                            {{ item.name }}
                        </div>
                    </div>
                </li>
            </ul>
            <ul :class="$style.maisongList" v-else>
                <li :class="$style.maisongListItem" v-for="(item, i) of 3" :key="i">
                    <div :class="$style.imgWrapper">
                        <img v-imgError src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/:class/mod$style.-popular-3.jpg" alt="">
                    </div>
                    <div :class="$style.info">
                        <PlSvg width="16" name="icon-gift-1" v-if="i === 0" />
                        <PlSvg width="16" name="icon-gift-2" v-if="i === 1" />
                        <PlSvg width="16" name="icon-gift-3" v-if="i === 2" />
                        <div :class="$style.sub">
                            下单即送
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'

@Component
export default class Maisong extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule
}
</script>

<style module lang="scss">
  .maisong {
    background: linear-gradient( 180deg, rgba(249, 217, 205, 1) 0%, rgba(243, 178, 119, 1) 11%, rgba(241, 163, 91, 1) 100%);
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .background {
      height: 226px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-gift-1.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    .inner {
      position: relative;
      top: -226px;
      padding: 56px 12px 24px;
      margin-bottom: -226px;
    }
    &-title {
      display: inline-block;
      padding: 0 10px;
      height: 26px;
      line-height: 26px;
      background:#FFF;
      border-radius: 146px;
      font-size: 14px;
      font-weight: 800;
      color: #EC7905;
      text-align: center;
      margin-bottom: 20px;
    }
    &-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      &-item {
        width: 103px;
        border-radius: 10px;
        overflow: hidden;
        &:nth-of-type(1) {
          .info {
            .sub {
              background: #EC7A05;
            }
          }
        }
        &.large {
          display: flex;
          padding: 0;
          width: 100%;
          background-color: #FFF;
          .img-wrapper {
            width: 190px;
            height: 126px;
            overflow: hidden;
          }
          .info {
            flex: 1;
            width: 0;
            justify-content: center;
          }
          svg {
            margin-bottom: 10px;
            width: 55px !important;
            height: 18px !important;
          }
          .sub {
            padding: 0 13px;
            height: 26px;
            line-height: 26px;
            font-size: 18px;
          }
        }
        &.middle {
          width: 155px;
          .img-wrapper {
            height: 105px;
          }
          svg {
            margin-bottom: 10px;
            width: 55px !important;
            height: 18px !important;
          }
          .sub {
            height: 26px;
            line-height: 26px;
            font-size: 16px;
          }
        }
      }
      .img-wrapper {
        height: 68px;
      }
      .info {
        padding: 8px 13px 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background: #FFF;
      }
      svg {
        margin-bottom: 4px;
        width: 35px !important;
        height: 11px !important;
      }
      .sub {
        padding: 0 6px;
        min-width: 64px;
        max-width: 100%;
        height: 17px;
        line-height: 17px;
        background: #B1712F;
        border-radius: 184px;
        font-size: 12px;
        font-weight: bold;
        color: #FFF;
        text-align: center;
        @include elps();
      }
    }
  }
</style>
