<template>
    <div :class="$style.miaosha">
        <div :class="$style.background" />
        <ul :class="$style.miaoshaList" v-if="data.values.length">
            <li :class="$style.miaoshaListItem" v-if="data.values[0].goodsInfo && data.values[0].goodsInfo.activityInfo">
                <div :class="$style.imgWrapper">
                    <img v-imgError :src="data.values[0].goodsInfo.productMainImage">
                    <div :class="$style.countdownWrapper">
                        <span :class="$style.text" v-if="data.values[0].goodsInfo.activityInfo.status === 0">距开始</span>
                        <span :class="$style.text" v-if="data.values[0].goodsInfo.activityInfo.status === 1">距结束</span>
                        <span :class="$style.text" v-if="data.values[0].goodsInfo.activityInfo.status === 2">已结束</span>
                        <Countdown
                            v-if="~[0, 1].indexOf(data.values[0].goodsInfo.activityInfo.status)"
                            :duration="getDuration(data.values[0].goodsInfo.activityInfo)"
                            @finish="() => data.values[0].goodsInfo.activityInfo.status += 1"
                        >
                            <template #default="{time}">
                                <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                                <span :class="$style.colon">天</span>
                                <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                                <span :class="$style.colon">:</span>
                                <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                                <span :class="$style.colon">:</span>
                                <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                            </template>
                        </Countdown>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.main">
                        {{ data.values[0].goodsInfo.productName }}
                    </div>
                    <div :class="$style.current">
                        <PlSvg name="icon-miaoshajia" width="30" height="19" />
                        <span :class="$style.price">
                            {{ data.values[0].goodsInfo.activityInfo.activityPrice }}
                        </span>
                    </div>
                    <div :class="$style.sub">
                        <div :class="$style.subLeft">
                            <div :class="$style.original">
                                <span v-if="data.values[0].goodsInfo.productSkuModels && data.values[0].goodsInfo.productSkuModels.length && getPrice(data.values[0].goodsInfo.productSkuModels)('originalPrice')">
                                    原价:<span :class="$style.price">{{ getPrice(data.values[0].goodsInfo.productSkuModels)('originalPrice') }}</span>
                                </span>
                            </div>
                            <div :class="$style.progress">
                                <div :class="$style.progressInner" :style="{ width: `${(Number(data.values[0].goodsInfo.activityInfo.number) - Number(data.values[0].goodsInfo.activityInfo.activityStock)) / Number(data.values[0].goodsInfo.activityInfo.number) * 100}%` }" />
                            </div>
                            <div :class="$style.saled" v-if="data.values[0].goodsInfo.activityInfo.status === 0">
                                {{ `${data.values[0].goodsInfo.pageviews}人已关注` }}
                            </div>
                            <div :class="$style.saled" v-if="data.values[0].goodsInfo.activityInfo.status > 0 && data.values[0].goodsInfo.activityInfo.activityStock > 0">
                                {{ `已抢${Number(data.values[0].goodsInfo.activityInfo.number) - Number(data.values[0].goodsInfo.activityInfo.activityStock)}件` }}
                            </div>
                            <div :class="$style.saled" v-if="data.values[0].goodsInfo.activityInfo.status > 0 && data.values[0].goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                                已抢完
                            </div>
                        </div>
                        <div :class="{
                            [$style.subRight]: true,
                            [$style.disabled]: data.values[0].goodsInfo.activityInfo.status !== 1
                        }">
                            <PlSvg
                                v-if="~[0, 1].indexOf(data.values[0].goodsInfo.activityInfo.status)"
                                name="icon-qiang"
                                width="19"
                            />
                            <PlSvg
                                v-else
                                name="icon-jieshu"
                                width="24"
                                height="11"
                            />
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <ul :class="$style.miaoshaList" v-else>
            <li :class="$style.miaoshaListItem">
                <div :class="$style.imgWrapper">
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/class/mod-popular-3.jpg" alt="">
                    <div :class="$style.countdownWrapper">
                        <span :class="$style.text">距开始</span>
                        <i :class="$style.block">02</i>天
                        <i :class="$style.block">23</i>:
                        <i :class="$style.block">59</i>:
                        <i :class="$style.block">59</i>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.main">
                        神奇的逻辑思维游戏畅销书
                    </div>
                    <div :class="$style.current">
                        <PlSvg name="icon-miaoshajia" width="30" height="19" />
                        <span :class="$style.price">10000</span>
                    </div>
                    <div :class="$style.sub">
                        <div :class="$style.subLeft">
                            <div :class="$style.original">
                                原价:
                                <span :class="$style.price">15000</span>
                            </div>
                            <div :class="$style.progress">
                                <div :class="$style.progressInner" :style="{ width: '50%' }" />
                            </div>
                            <div :class="$style.saled">
                                已抢40件
                            </div>
                        </div>
                        <div :class="$style.subRight">
                            <PlSvg name="icon-qiang" width="19" />
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Countdown from '../../Countdown.vue'
import { getPrice, getDuration } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Miaosha extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getPrice = getPrice
    getDuration = getDuration
}
</script>

<style module lang="scss">
  .miaosha {
    background: linear-gradient(180deg, #F2BAA7 0%, #E45750 12%, #E45750 100%);
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .background {
      height: 226px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-miaosha.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    &-list {
      position: relative;
      top: -176px;
      padding: 70px 10px 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: -176px;
    }
    &-list-item {
      display: flex;
      margin-bottom: 10px;
      padding: 8px;
      width: 100%;
      background-color: #FFF;
      border-radius: 10px;
      overflow: hidden;
      .img-wrapper {
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 8px;
        width: 140px;
        height: 94px;
        .countdown-wrapper {
          display: flex;
          justify-content: space-around;
          align-items: center;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 26px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.65);
          color: #FFF;
        }
        .block {
            display: inline-block;
            box-sizing: border-box;
            padding: 0 2px;
            height: 18px;
            line-height: 18px;
            background: rgba(174, 174, 174, .64);
            border-radius: 2px;
        }
      }
      .info {
        flex: 1;
        width: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        position: relative;
      }
      .main {
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        color: #000000;
        @include elps();
      }
      .current {
        margin-bottom: 1px;
        display: flex;
        align-items: flex-end;
        color: #FE3C5E;
        @include elps();
        .price {
          flex: 1;
          width: 0;
          margin-left: 2px;
          font-size: 20px;
          font-family: San Francisco Display;
          font-weight: bold;
          @include elps();
          &:before {
            content: '￥';
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: bold;
          }
        }
      }
      .sub {
        display: flex;
        align-items: flex-end;
        &-left {
          flex: 1;
          width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .original {
            display: flex;
            align-items: flex-end;
            margin-bottom: 7px;
            height: 16px;
            font-size: 10px;
            color: #999999;
            @include elps();
            .price {
              flex: 1;
              width: 0;
              font-family: San Francisco Display;
              text-decoration: line-through;
              @include elps();
              &:before {
                content: '￥';
                font-family: Microsoft YaHei;
              }
            }
          }
          .progress {
            width: 122px;
            height: 7px;
            background: #FFD2D2;
            border-radius: 103px;
            overflow: hidden;
            &-inner {
              height: 7px;
              background: #F55959;
              border-radius: 103px;
            }
          }
          .saled {
            font-size: 10px;
            font-weight: 600;
            color: #FE3C5E;
          }
        }
        &-right {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(231deg, rgba( 238, 144, 111, 1) 0%, rgba(233, 70, 115, 1) 100%);
          border-radius: 50%;
          overflow: hidden;
          color: #ffffff;
          &.disabled {
            background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
          }
        }
      }
    }
  }
</style>
