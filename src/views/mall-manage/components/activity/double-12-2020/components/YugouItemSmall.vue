<template>
    <li v-if="data.goodsInfo && data.goodsInfo.activityInfo" :class="$style.yugouItemSmall">
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
        </div>
        <div :class="$style.bar">
            <div :class="$style.rule">
                <b v-if="data.goodsInfo.activityInfo.multiple && data.goodsInfo.activityInfo.multipleNumber > 1 && data.goodsInfo.activityInfo.activityPrice">{{ `定金${Number(data.goodsInfo.activityInfo.price)}元 抵${Number(data.goodsInfo.activityInfo.activityPrice)}元` }}</b>
                <b v-else>{{ `预交定金${Number(data.goodsInfo.activityInfo.price)}元` }}</b>
            </div>
            <div :class="$style.countdownWrapper">
                <span v-if="data.goodsInfo.activityInfo.status === 0">距开始：</span>
                <span v-if="data.goodsInfo.activityInfo.status === 1">距结束：</span>
                <span v-if="data.goodsInfo.activityInfo.status === 2">已结束</span>
                <slot name="countdown">
                    <Countdown
                        v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                        :duration="getDuration(data.goodsInfo.activityInfo)"
                        format="DD天HH:mm:ss"
                        @finish="() => data.goodsInfo.activityInfo.status += 1"
                    />
                </slot>
            </div>
        </div>
        <div :class="$style.info">
            <div :class="$style.name">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.price">
                到手价：<b>{{ getTotalPrice(data) }}</b>
            </div>
            <div :class="$style.sub">
                <del :class="$style.original">{{ `现价 ¥${getPrice(data.goodsInfo.productSkuModels)('price')}` }}</del>
                <span :class="$style.count">{{ `${data.goodsInfo.activityInfo.number}人预定` }}</span>
            </div>
        </div>
    </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModuleItem } from '../../../../utils/types'
import Countdown from '../../../Countdown.vue'
import { getDuration, getTotalPrice, getPrice } from '../../../../utils/helper'

@Component({
    components: {
        Countdown
    }
})
export default class YugouItemSmall extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateModuleItem

    /* methods */
    getDuration = getDuration
    getTotalPrice = getTotalPrice
    getPrice = getPrice
}
</script>

<style lang="scss" module>
.yugou-item-small {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 156px;
    height: 232px;
    background: #ffffff;
    border-radius: 10px;
    .img-wrapper {
        position: relative;
        box-sizing: border-box;
        padding: 2px 2px 0;
        width: 100%;
        height: 106px;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px 10px 0 0;
    }
    .bar {
        position: relative;
        box-sizing: border-box;
        padding: 27px 0px 2px;
        height: 43px;
        background: rgba(0, 0, 0, .6);
    }
    .rule {
        position: absolute;
        left: 0;
        top: -3px;
        box-sizing: border-box;
        padding: 0 5px;
        width: 135px;
        line-height: 30px;
        text-align: center;
        background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: -12px;
            width: 12px;
            height: 34px;
            background: linear-gradient(-105deg, transparent 12px, #FFEB12 13px, #FFC26F 100%);
        }
        > b {
            display: block;
            font-size: 12px;
            color: #D00C06;
            @include elps();
        }
    }
    .countdown-wrapper {
        font-size: 10px;
        color: #FFFFFF;
        transform: scale(0.9);
    }
    .info {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 13px 9px 11px;
        .name {
            font-family: Microsoft YaHei;
            font-weight: 600;
            font-size: 12px;
            color: #000;
            @include elps();
        }
        .price {
            margin-top: 1px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            font-size: 12px;
            color: #D00C06;
            @include elps();
            > b {
                font-size: 18px;
                &::before {
                    content: '￥';
                    font-size: 12px;;
                }
            }
        }
        .sub {
            margin-top: auto;
            display: flex;
            align-items: center;
            font-size: 12px;
            @include elps();
        }
        .original {
            font-size: 12px;
            color: #999999;
        }
        .count {
            margin-left: auto;
            color: #333333;
        }
    }
}

</style>
