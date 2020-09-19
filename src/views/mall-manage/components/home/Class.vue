<template>
    <div :class="$style.class">
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo"
                    :class="{
                        [$style.listItem]: true,
                        [$style.large]: i === 0 && isOdd,
                        [$style.marginT0]: (i === 0) || (i === 1 && !isOdd)
                    }"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img v-imgError :src="item.goodsInfo.productMainImage">
                        <div :class="$style.top" v-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'">
                            体验课
                        </div>
                    </div>
                    <div :class="$style.itemInfo">
                        <h4>{{ item.goodsInfo.productName }}</h4>
                        <div :class="$style.infoGroup">
                            <p :class="$style.infoText">
                                <b><i>￥</i>{{ item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('price') }}</b>
                                <template v-if="item.goodsInfo.showSales">
                                    <span v-if="item.goodsInfo.salesVolume === 0">
                                        正在热销中
                                    </span>
                                    <span v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
                                        {{ item.goodsInfo.pageviews }}人关注
                                    </span>
                                    <span v-else-if="item.goodsInfo.salesVolume >= 10">
                                        {{ `${item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume}人${productTypeMap2[item.goodsInfo.productType]}` }}
                                    </span>
                                </template>
                            </p>
                            <div :class="$style.infoBtn">
                                {{ `立即${productTypeMap2[item.goodsInfo.productType]}` }}
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.list" v-else>
            <li
                :class="{
                    [$style.listItem]: true,
                    [$style.marginT0]: i === 0 || i === 1
                }"
                v-for="(item, i) of defaultData" :key="i"
            >
                <div :class="$style.imgWrapper">
                    <img v-imgError :src="item.img">
                </div>
                <div :class="$style.itemInfo">
                    <h4>{{ item.name }}</h4>
                    <div :class="$style.infoGroup">
                        <p :class="$style.infoText">
                            <b><i>￥</i>{{ item.price }}</b>
                            <span>33人报名</span>
                        </p>
                        <div :class="$style.infoBtn">
                            立即学习
                        </div>
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
export default class Class extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    defaultData = Object.freeze(defaultData.Class)
    productTypeMap2 = Object.freeze(productTypeMap2)

    /* computed */
    get isOdd () {
        return !!(this.data.values.length % 2)
    }

    /* methods */
    getPrice = getPrice
}
</script>

<style module lang="scss">
.class {
    .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .list-item {
        margin-top: 10px;
        width: 170px;
        border-radius: 10px;
        overflow: hidden;
        &.large {
            width: 100%;
            .img-wrapper {
                width: 100%;
                height: 235px;
            }
            .top {
                padding: 3px 8px;
                font-size: 16px;
                line-height: 20px;
            }
            .item-info {
                height: auto;
                > h4 {
                    height: 36px;
                    line-height: 18px;
                    font-size: 14px;
                }
            }
        }
        &.margin-t-0 {
            margin-top: 0;
        }
        .img-wrapper {
            position: relative;
            width: 100%;
            height: 114px;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .top {
            position: absolute;
            top: 8px;
            left: 8px;
            padding: 2px 6px;
            line-height: 16px;
            font-size: 12px;
            color: #fff;
            background-color: #f2b036;
            border-radius: 5px;
        }
        .item-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 8px;
            box-sizing: border-box;
            height: 93px;
            background-color: #fff;
            > h4 {
                font-size: 12px;
                height: 32px;
                line-height: 16px;
                color: #000;
                @include elps-wrap(2);
            }
            .info-group {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 8px;
                .info-text {
                    flex: 1;
                    width: 0;
                    display: flex;
                    flex-direction: column;
                    font-size: 12px;
                    color: #fe7700;
                    @include elps();
                    > b {
                        font-size: 16px;
                        @include elps();
                        > i {
                            font-size: 12px;
                        }
                    }
                    > span {
                        font-size: 10px;
                        @include elps();
                    }
                }
                .info-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 62px;
                    height: 24px;
                    color: #fff;
                    font-size: 12px;
                    background: #fe7700;
                    border-radius: 4px;
                }
            }
        }
    }
}

</style>
