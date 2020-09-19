<template>
    <div :class="$style.popular">
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
                    </div>
                    <div :class="$style.itemInfo">
                        <h4>{{ item.goodsInfo.productName }}</h4>
                        <p :class="$style.infoTags">
                            <template v-for="(label, j) of ((i === 0 && isOdd) ? item.goodsInfo.labelModels : item.goodsInfo.labelModels.slice(0, 2))">
                                <span
                                    v-if="label && !!label.labelName"
                                    :key="j"
                                    :style="{ color: labelColor[j], borderColor: labelColor[j] }"
                                >
                                    {{ label.labelName }}
                                </span>
                            </template>
                        </p>
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
                                    {{ `${item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume}` }}人付款
                                </span>
                            </template>
                        </p>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.list" v-else>
            <li
                :class="{
                    [$style.listItem]: true,
                    [$style.large]: i === 0,
                    [$style.marginT0]: i === 0
                }"
                v-for="(item, i) of defaultData"
                :key="i"
            >
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
                    <p :class="$style.infoText">
                        <b><i>￥</i>{{ item.price }}</b>
                        <span>33人付款</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'
import defaultData from '../../utils/template-default-data/basic'
import { getPrice } from '../../utils/helper'

@Component
export default class Popular extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    labelColor = ['#E83B27', '#92B1E5', '#F3BE41', '#60C684']
    defaultData = Object.freeze(defaultData.Popular)

    /* computed */
    get isOdd () {
        return !!(this.data.values.length % 2)
    }

    /* methods */
    getPrice = getPrice
}
</script>

<style module lang="scss">
.popular {
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
            .item-info {
                height: auto;
                > h4 {
                    margin-bottom: 7px;
                    -webkit-line-clamp: 1;
                }
            }
        }
        &.margin-t-0 {
            margin-top: 0;
        }
        .img-wrapper {
            width: 100%;
            height: 114px;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .item-info {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 8px;
            height: 112px;
            background-color: #fff;
            > h4 {
                margin-bottom: 4px;
                font-size: 14px;
                line-height: 18px;
                color: #000;
                @include elps-wrap(2);
            }
            .info-text {
                margin-top: auto;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                font-size: 12px;
                color: #999;
                @include elps();
                > b {
                    flex: 1;
                    width: 0;
                    font-size: 20px;
                    color: #fe7700;
                    @include elps();
                    > i {
                        font-size: 12px;
                    }
                }
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
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    &:last-of-type {
                        margin-right: 0;
                    }
                }
            }
        }
    }
}

</style>
