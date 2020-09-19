<template>
    <div class="coupon">
        <div class="coupon-title" v-if="data.otherValue > 0">
            {{ `- ${data.otherValue}人已领券 快来领取 -` }}
        </div>
        <div class="coupon-title" v-else>
            - 快来领取 -
        </div>
        <ul class="coupon-list" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo"
                    class="coupon-list-item"
                    :class="{
                        large: data.values.length < 3,
                        small: data.values.length === 3
                    }"
                    :key="i"
                >
                    <div class="coupon-list-item-wrapper">
                        <div class="price">
                            ￥ <span class="number">{{ item.goodsInfo.amount }}</span>
                        </div>
                        <div>{{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}</div>
                        <div class="date">
                            {{ `${getDate(item.goodsInfo.useStartTime, 'MM/DD')}-${getDate(item.goodsInfo.useEndTime, 'MM/DD')}` }}
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul class="coupon-list" v-else>
            <li class="coupon-list-item small" v-for="(item, i) of 3" :key="i">
                <div class="coupon-list-item-wrapper">
                    <div class="price">
                        ￥ <span class="number">30</span>
                    </div>
                    <div>无门槛</div>
                    <div class="date">
                        4/15-4/30
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { getDate } from '../../utils/helper'

export default {
    name: 'Coupon',
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        getDate
    }
}
</script>

<style scoped lang="scss">
  .coupon {
    margin: 0 -12px 12px;
    background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/color-bar.png") no-repeat center bottom;
    background-size: 100% auto;
    box-shadow: 0 10px 10px #8A0108;
    &-title {
      padding: 6px 0 12px;
      font-size: 14px;
      line-height: 18px;
      color: #FFF;
      text-align: center;
    }
    &-list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-bottom: 15px;
      &-item {
        height: 78px;
        font-size: 10px;
        color: #FFF;
        line-height: 18px;
        &.large {
          width: 173px;
          background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-coupon-large.png") no-repeat center center;
          background-size: 100% 100%;
          .number {
            font-size: 20px;
            margin-right: 3px;
          }
        }
        &.small {
          width: 110px;
          background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-coupon.png") no-repeat center center;
          background-size: 100% 100%;
        }
        &-wrapper {
          padding: 6px 5px 10px;
        }
        .price {
          font-size: 12px;
          margin-right: 3px;
        }
        .number {
          font-size: 16px;
          font-family: San Francisco Display;
          font-weight: bold;
        }
        .date {
          margin-top: 2px;
          font-family: San Francisco Display;
        }
      }
    }
  }
</style>
