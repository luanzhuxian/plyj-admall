<template>
    <div :class="$style.coupon">
        <div :class="$style.bg">
            <div :class="$style.couponTitle">
                购物先领券 就要划算
            </div>
            <div :class="$style.couponSubtitle">
                {{ data.otherValue > 0 ? `${data.otherValue}人已领券 快来领取` : '快来领取' }}
            </div>
            <div :class="$style.couponButton">
                <PlSvg name="icon-envelope-mini" width="16" height="16" style="margin-right: 5px;" />
                <span>优惠券中心</span>
                <span :class="$style.btn">
                    <span>领取更多</span>
                    <i class="el-icon-arrow-right" />
                </span>
            </div>
            <ul :class="$style.couponList" v-if="data.values.length">
                <template v-for="(item, i) of data.values">
                    <li
                        v-if="item.goodsInfo"
                        :class="$style.couponListItem"
                        :key="i"
                    >
                        <div :class="$style.left">
                            <span :class="$style.number">{{ item.goodsInfo.amount }}</span>
                        </div>
                        <div :class="$style.middle">
                            <b :class="$style.main">
                                <span v-if="item.goodsInfo.couponType === 1">满减券</span>
                                <span v-if="item.goodsInfo.couponType === 2">品类券</span>
                            </b>
                            <p :class="$style.sub">
                                {{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}
                            </p>
                            <p :class="$style.date">
                                {{ `(有效期至${getDate(item.goodsInfo.useEndTime, 'YYYY.MM.DD')})` }}
                            </p>
                        </div>
                        <div :class="$style.right">
                            免费领取
                        </div>
                    </li>
                </template>
            </ul>
            <ul :class="$style.couponList" v-else>
                <li :class="$style.couponListItem" v-for="(item, i) of 3" :key="i">
                    <div :class="$style.left">
                        <span :class="$style.number">30</span>
                    </div>
                    <div :class="$style.middle">
                        <b :class="$style.main">
                            满减券
                        </b>
                        <p :class="$style.sub">
                            无门槛
                        </p>
                        <p :class="$style.date">
                            (有效期至2019.12.12)
                        </p>
                    </div>
                    <div :class="$style.right">
                        免费领取
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import { getDate } from '../../../utils/helper'

@Component
export default class Coupon extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getDate = getDate
}
</script>

<style module lang="scss">
  .coupon {
    background: #EF5B3F;
    box-shadow: 0px 8px 12px rgba(121, 30, 5, 0.2);
    border-radius: 10px;
    overflow: hidden;
    .bg {
      padding: 10px 14px 14px;
      background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/fa1c99ec-c614-4b87-a713-6d0def781e20.png") no-repeat center top;
      background-size: 100% auto;
    }
    &-title {
      font-size: 20px;
      font-weight: 800;
      color: #FFF9ED;
      text-align: center;
      letter-spacing: 2px;
    }
    &-subtitle {
      margin-top: 5px;
      font-size: 14px;
      color: #FFF9ED;
      text-align: center;
      letter-spacing: 1px;
    }
    &-button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 26px;
      font-size: 12px;
      color: #FFE9BE;
      line-height: 19px;
      .btn {
        box-sizing: border-box;
        margin-left: 6px;
        width: 81px;
        height: 21px;
        border: 1px solid #FFE9BE;
        border-radius: 50px;
        font-weight: 800;
        text-align: center;
      }
    }
    &-list {
      margin-top: 10px;
      &-item {
        display: flex;
        align-items: center;
        margin-top: 16px;
        background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/c775af74-0fa4-4506-8bb2-8623c58bc5fd.png") no-repeat center;
        background-size: 100%;
        height: 90px;
        padding: 0 18px 0 10px;
        text-align: center;
        :nth-of-type(1) {
          margin: 0;
        }
        .left {
          width: 87px;
          font-size: 22px;
          font-family: San Francisco Display;
          font-weight: bold;
          color: #E72441;
          @include elps();
          &:after {
            content: '元';
            font-size: 15px;
            font-weight: bold;
          }
        }
        .middle {
          flex: 1;
          width: 0;
          padding-left: 12px;
          text-align: left;
          font-size: 12px;
          font-family: Microsoft YaHei;
          color: #EC535B;
          > .main {
            font-size: 16px;
            color: #E72441;
          }
          > .sub {
            margin-top: 2px;
            color: #EC535B;
          }
          >.date {
            margin-top: 5px;
            color: #F19874;
          }
        }
        .right {
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 19px;
          width: 68px;
          height: 66px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #FFFFFF;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
</style>
