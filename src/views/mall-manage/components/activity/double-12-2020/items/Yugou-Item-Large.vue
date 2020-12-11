<template>
    <li v-if="data.goodsInfo && data.goodsInfo.activityInfo" :class="$style.yugouItemLarge">
        <div :class="$style.imgWrapper" class="img-wrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
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
        </div>
        <div :class="$style.info">
            <div :class="$style.name">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.sub">
                <div :class="$style.price">
                    到手价：<b>{{ getTotalPrice(data) }}</b>
                </div>
                <del :class="$style.original">{{ `现价：¥${data.goodsInfo.activityInfo.skuPrice}` }}</del>
                <span :class="$style.count">{{ `${data.goodsInfo.activityInfo.number}人预定` }}</span>
            </div>
        </div>
    </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModuleItem } from '../../../../utils/types'
import Countdown from '../../../Countdown.vue'
import { getDuration, getTotalPrice } from '../../../../utils/helper'

@Component({
    components: {
        Countdown
    }
})
export default class YugouItemLarge extends Vue {
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
}
</script>

<style lang="scss" module>
.yugou-item-large {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 5px;
    width: 100%;
    height: 290px;
    background: #ffffff;
    border-radius: 20px;
    .img-wrapper {
        position: relative;
        width: 100%;
        height: 213px;
        border-radius: 20px 20px 0 0;
        &::before {
            content: '';
            position: absolute;
            top: -4px;
            left: 10px;
            box-sizing: border-box;
            padding: 6px 10px 0 0;
            width: 68px;
            height: 38px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/ribbon.png') no-repeat center;
            background-size: 100%;
        }
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px 20px 0 0;
    }
    .bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 32px;
        background: rgba(0, 0, 0, .6);
        z-index: 1;
    }
    .rule {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0 10px;
        max-width: 175px;
        line-height: 35px;
        text-align: center;
        background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
        z-index: 2;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: -12px;
            width: 12px;
            height: 38px;
            background: linear-gradient(-105deg, transparent 12px, #FFEB12 13px, #FFC26F 100%);
        }
        > b {
            display: block;
            font-size: 16px;
            color: #D00C06;
            @include elps();
        }
    }
    .countdown-wrapper {
        padding: 0 10px;
        font-size: 12px;
        color: #FFFFFF;
    }
    .info {
        flex: 1;
        padding: 6px 10px;
        .name {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #000;
            @include elps();
        }
        .sub {
            display: flex;
            align-items: baseline;
            margin-top: 1px;
            font-size: 12px;
            @include elps();
        }
        .price {
            font-family: Microsoft YaHei;
            font-weight: 600;
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
        .original {
            margin-left: 13px;
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
