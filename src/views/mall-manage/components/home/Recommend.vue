<template>
    <div
        :class="{
            [$style.recommend]: true,
            [$style.border]: !!border
        }"
        :style="{ '--border': border }"
    >
        <ul :class="$style.recommendList" v-if="data.values.length">
            <li :class="$style.recommendListItem" v-for="(item, i) of data.values" :key="i">
                <div :class="$style.imgWrapper">
                    <img v-imgError v-if="item.goodsInfo" :src="item.goodsInfo.productMainImage">
                    <div :class="$style.top" v-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'">
                        体验课
                    </div>
                    <div :class="$style.bottom" v-if="item.goodsInfo.showSales">
                        <PlSvg name="icon-hot" width="24" height="14" />
                        <span v-if="item.goodsInfo.salesVolume === 0">
                            正在热销中
                        </span>
                        <span v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
                            {{ item.goodsInfo.pageviews }}人关注
                        </span>
                        <span v-else-if="item.goodsInfo.salesVolume >= 10">
                            {{ `${item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume}人${productTypeMap2[item.goodsInfo.productType]}` }}
                        </span>
                    </div>
                </div>
                <div :class="$style.itemInfo" v-if="item.goodsInfo">
                    <h4>{{ item.goodsInfo.productName }}</h4>
                    <p :class="$style.infoTags">
                        <template v-for="(label, j) of item.goodsInfo.labelModels">
                            <span
                                v-if="label && !!label.labelName"
                                :key="j"
                                :style="{ color: labelColor[j], borderColor: labelColor[j] }"
                            >
                                {{ label.labelName }}
                            </span>
                        </template>
                    </p>
                    <div :class="$style.infoText">
                        <template v-if="item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length">
                            <slot name="price" :price="getPrice(item.goodsInfo.productSkuModels)('price')" v-if="$scopedSlots.price" />
                            <template v-else>
                                <b :style="{ color: btnColor }"><i>￥</i>{{ getPrice(item.goodsInfo.productSkuModels)('price') }}</b>
                                <del>{{ `￥${getPrice(item.goodsInfo.productSkuModels)('originalPrice')}` }}</del>
                            </template>
                            <button :style="{ backgroundColor: btnColor }">
                                {{ `立即${productTypeMap2[item.goodsInfo.productType]}` }}
                            </button>
                        </template>
                    </div>
                </div>
            </li>
        </ul>
        <ul :class="$style.recommendList" v-else>
            <li :class="$style.recommendListItem" v-for="(item, i) of defaultData" :key="i">
                <div :class="$style.imgWrapper">
                    <img v-imgError :src="item.img">
                </div>
                <div :class="$style.itemInfo">
                    <h4>{{ item.name }}</h4>
                    <p :class="$style.infoTags">
                        <span
                            v-for="(label, j) of item.labels"
                            :key="j"
                            :style="{ color: labelColor[j], borderColor: labelColor[j] }"
                        >
                            {{ label }}
                        </span>
                    </p>
                    <div :class="$style.infoText">
                        <slot name="price" :price="item.price" v-if="$scopedSlots.price" />
                        <template v-else>
                            <b :style="{ color: btnColor }"><i>￥</i>{{ item.price }}</b>
                            <del>￥{{ item.original }}</del>
                        </template>
                        <button :style="{ backgroundColor: btnColor }">
                            立即报名
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'
import defaultData from '../../utils/template-default-data/basic'
import { productTypeMap2 } from '../../utils/map'
import { getPrice } from '../../utils/helper'

@Component
export default class Recommend extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    @Prop({
        type: String,
        default: '#FE7700'
    }) readonly btnColor!: string

    @Prop(String) border!: string

    /* data */
    defaultData = Object.freeze(defaultData.Recommend)
    productTypeMap2 = Object.freeze(productTypeMap2)
    labelColor = Object.freeze(['#E83B27', '#92B1E5', '#F3BE41', '#60C684'])

    /* methods */
    getPrice = getPrice
}
</script>

<style module lang="scss">
  .recommend {
    &.border {
      .recommend-list-item,
      .img-wrapper {
        border: var(--border);
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &-list-item {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      margin-top: 14px;
      padding: 8px;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      &:nth-of-type(1) {
        margin-top: 0;
      }
      .top {
        position: absolute;
        padding: 3px 12px;
        top: 10px;
        left: 10px;
        font-size: 14px;
        color: #fff;
        background-color: #F2B036;
        border-radius: 5px;
      }
      .bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        padding: 8px 10px;
        font-size: 14px;
        color: #fff;
        background: linear-gradient(0, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
      }
      .img-wrapper {
        position: relative;
        width: 100%;
        height: 212px;
        border-radius: 10px;
        overflow: hidden;
      }
      .item-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 8px 0 4px;
        height: 122px;
        > h4 {
          margin-bottom: 4px;
          font-size: 16px;
          color: #000;
          @include elps-wrap(2);
        }
        .info-tags {
          min-height: 20px;
          margin-bottom: 8px;
          @include elps();
          > span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 20px;
            margin-right: 6px;
            padding: 0 6px;
            font-size: 12px;
            border: 1px solid #CCCCCC;
            border-radius: 4px;
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
        .info-text {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: auto;
          &:last-of-type {
            margin-bottom: 0;
          }
          > b {
            font-size: 24px;
            color: #FE7700;
            @include elps();
            > i {
              font-size: 14px;
            }
          }
          > del {
            margin-left: 6px;
            font-size: 14px;
            color: #999999;
            @include elps();
          }
          > button {
            display: block;
            margin-left: auto;
            width: 90px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            color: #ffffff;
            font-size: 16px;
            background: #FE7700;
            border-radius: 4px;
            border: none;
          }
        }
      }
    }
  }
</style>
