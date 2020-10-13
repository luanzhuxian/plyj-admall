<template>
    <div
        :class="{
            [$style.fengqiang]: true,
            [$style.bg1]: tmplType === 5,
            [$style.bg2]: tmplType === 6,
            [$style.bg3]: tmplType === 7
        }"
    >
        <div :class="$style.background" />
        <ul :class="$style.fengqiangList" v-if="data.values.length">
            <li
                :class="{
                    [$style.fengqiangListItem]: true,
                    [$style.large]: data.values.length % 2 === 1,
                    [$style.snall]: data.values.length % 2 === 0
                }"
                v-for="(item, i) of data.values"
                :key="i"
            >
                <div :class="$style.imgWrapper">
                    <img :src="item.goodsInfo.productMainImage">
                </div>
                <div :class="$style.itemInfo" v-if="tmplType === 5 || tmplType === 7">
                    <h4>{{ item.goodsInfo.productName }}</h4>
                    <div :class="$style.infoText">
                        <PlSvg name="icon-fengqiangjia" width="39" height="24" style="margin-right: 4px;" />
                        <span :class="$style.price" v-if="item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length">
                            {{ getPrice(item.goodsInfo.productSkuModels)('price') }}
                        </span>
                        <span v-if="item.goodsInfo.salesVolume < 10">
                            {{ item.goodsInfo.pageviews }}人关注
                        </span>
                        <span v-else>
                            {{ `${item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume}` }}人付款
                        </span>
                        <div :class="$style.btnHighlight">
                            <PlSvg name="icon-mashangqiang" width="59" height="23" />
                        </div>
                    </div>
                </div>
                <div :class="$style.itemInfo" v-if="tmplType === 6">
                    <h4>{{ item.goodsInfo.productName }}</h4>
                    <div :class="$style.infoText">
                        <span :class="$style.price" v-if="item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length">
                            {{ getPrice(item.goodsInfo.productSkuModels)('price') }}
                        </span>
                        <span :class="$style.tag" v-if="coupon.useLimitAmount && coupon.amount">
                            {{ `满${coupon.useLimitAmount}减${coupon.amount}` }}
                        </span>
                        <div :class="$style.btn">
                            马上抢！
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <ul :class="$style.fengqiangList" v-else>
            <li :class="$style.fengqiangListItem" v-for="(item, i) of defaultData" :key="i">
                <div :class="$style.imgWrapper">
                    <img :src="item.img">
                </div>
                <div :class="$style.itemInfo" v-if="tmplType === 5 || tmplType === 7">
                    <h4>{{ item.name }}</h4>
                    <div :class="$style.infoText">
                        <PlSvg name="icon-fengqiangjia" width="39" height="24" style="margin-right: 4px;" />
                        <span :class="$style.price">{{ item.price }}</span>
                        <span>33人付款</span>
                        <div :class="$style.btnHighlight">
                            <PlSvg name="icon-mashangqiang" width="59" height="23" />
                        </div>
                    </div>
                </div>
                <div :class="$style.itemInfo" v-if="tmplType === 6">
                    <h4>{{ item.name }}</h4>
                    <div :class="$style.infoText">
                        <span :class="$style.price">1000</span>
                        <span :class="$style.tag">
                            满5000减500
                        </span>
                        <div :class="$style.btn">
                            马上抢！
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import defaultData from '../../../utils/template-default-data/basic'
import { TemplateModule } from '../../../utils/types'
import { TemplateTypes } from '../../../utils/map'
import { getPrice } from '../../../utils/helper'
import { getMaxCoupon } from '../../../../../apis/mall'

@Component
export default class Fengqiang extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    @Prop({
        type: Number,
        default: 0
    }) readonly tmplType!: number

    /* data */
    coupon = {}
    defaultData = Object.freeze(defaultData.Popular)

    async created () {
        if (this.tmplType === TemplateTypes.TemplateBaoFa) {
            try {
                const { result } = await getMaxCoupon()
                this.coupon = result
            } catch (error) {
                throw error
            }
        }
    }

    /* methods */
    getPrice = getPrice
}
</script>

<style module lang="scss">
  .fengqiang {
    background: linear-gradient(180deg, rgba(242, 183, 164, 1) 0%, rgba(228, 89, 83, 1) 12%, rgba(228, 87, 80, 1) 100%);
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &.bg-1 > .background {
      height: 226px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-qiang-1.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    &.bg-3 > .background {
      height: 226px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-qiang-3.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    &.bg-2 {
      background: #FF0B00 !important;
      .background {
        height: 226px;
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-qiang-2.jpg") no-repeat center top;
        background-size: 100% auto;
      }
      .fengqiang-list {
        top: -202px !important;
        margin-bottom: -202px !important;
        .fengqiang-list-item > .item-info {
          padding: 0!important;
          h4 {
            margin: 0 !important;
            padding: 0 8px;
            height: 34px !important;;
            line-height: 34px !important;;
            background-color: #FDFEFB;
          }
          .info-text {
            justify-content: flex-start;
            align-items: center !important;
            height: 46px;
            line-height: 46px;
            background-color: #FE3C5E;
            .price {
              margin: 0 !important;
              padding: 0 8px;
              font-size: 22px !important;
              font-family: San Francisco Display !important;
              font-weight: bold !important;
              color: #FFFF00 !important;
              &::before {
                content: '￥';
                font-size: 11px;
                font-family: Microsoft YaHei;
                font-weight: bold;
              }
            }
            .tag {
              padding: 0 4px;
              height: 20px;
              line-height: 20px;
              background: #D5193A;
              border-radius: 2px;
              font-size: 14px;
              font-family: Microsoft YaHei;
              color: #FFFFFF;
            }
            .btn {
              margin-left: auto;
              padding-left: 20px;
              width: 90px;
              height: 46px;
              line-height: 46px;
              color: #FE3C5E;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              background: linear-gradient(135deg, transparent 16px, #FFFF00 0) top left,
                          linear-gradient(-135deg, transparent 0px, #FFFF00 0) top right,
                          linear-gradient(-45deg, transparent 0px, #FFFF00 0) bottom right,
                          linear-gradient(45deg, transparent 16px, #FFFF00 0) bottom left;
              background-size: 51% 51%;
              background-repeat: no-repeat;
            }
          }
        }
      }
    }
    &-list {
      position: relative;
      top: -226px;
      padding: 70px 10px 25px;
      margin-bottom: -226px;
      &-item {
        margin-top: 10px;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        &:first-of-type {
          margin-top: 0;
        }
        .img-wrapper {
          width: 100%;
          height: 222px;
          overflow: hidden;
        }
        .item-info {
          padding: 8px;
          > h4 {
            margin-bottom: 8px;
            height: 1;
            line-height: 22px;
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            @include elps();
          }
          .info-text {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 11px;
            line-height: 26px;
            color: #999999;
            @include elps();
            .price {
              margin-right: 8px;
              font-size: 22px;
              font-family: Helvetica;
              font-weight: bold;
              color: #FE3C5E;
              @include elps();
              &::before {
                content: '¥';
                font-size: 11px;
                font-weight: 600;
                line-height: 16px;
              }
            }
            .btn-highlight {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: auto;
              background: linear-gradient(225deg, rgba(238, 144, 111, 1) 0%, rgba(233, 70, 115, 1) 100%);
              border-radius: 4px;
              padding: 4px 11px;
            }
          }
        }
      }
    }
  }
</style>
