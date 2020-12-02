<template>
    <li v-if="data.goodsInfo && data.goodsInfo.activityInfo" :class="$style.miaoshaListItem">
        <div :class="$style.miaoshaListItemBack">
            <div :class="$style.miaoshaListItemFront">
                <div :class="$style.imgWrapper">
                    <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                </div>
                <div :class="$style.info">
                    <div :class="$style.name">
                        {{ data.goodsInfo.productName }}
                    </div>
                    <div :class="$style.middle">
                        <label for="price">秒杀价:</label>
                        <b :class="$style.price">{{ data.goodsInfo.activityInfo.activityPrice }}</b>
                        <del :class="$style.original" v-if="data.goodsInfo.productSkuModels && data.goodsInfo.productSkuModels.length && getPrice(data.goodsInfo.productSkuModels)('originalPrice')">
                            {{ `原价:${getPrice(data.goodsInfo.productSkuModels)('originalPrice')}元` }}
                        </del>
                    </div>

                    <div :class="$style.progress">
                        <div :class="$style.progressInner" :style="{ width: `${(Number(data.goodsInfo.activityInfo.number) - Number(data.goodsInfo.activityInfo.activityStock)) / Number(data.goodsInfo.activityInfo.number) * 100}%` }" />
                    </div>
                    <div :class="$style.saled" v-if="data.goodsInfo.activityInfo.status === 0">
                        {{ `${data.goodsInfo.pageviews}人已关注` }}
                    </div>
                    <div :class="$style.saled" v-if="data.goodsInfo.activityInfo.status > 0 && data.goodsInfo.activityInfo.activityStock > 0">
                        {{ `已抢购${Number(data.goodsInfo.activityInfo.number) - Number(data.goodsInfo.activityInfo.activityStock)}件` }}
                    </div>
                    <div :class="$style.saled" v-if="data.goodsInfo.activityInfo.status > 0 && data.goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                        已抢完
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style.miaoshaListItemBottom">
            <div :class="$style.countdownWrapper">
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 0">距离活动开始还剩</span>
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 1">距离活动结束还剩</span>
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 2">已结束</span>
                <template v-if="isDefault">
                    <i :class="$style.block">02</i>
                    <span :class="$style.colon">天</span>
                    <i :class="$style.block">23</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">59</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">59</i>
                </template>
                <template v-else>
                    <Countdown
                        v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                        :duration="getDuration(data.goodsInfo.activityInfo)"
                        @finish="() => data.goodsInfo.activityInfo.status += 1"
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
                </template>
            </div>
            <div :class="{
                [$style.miaoshaListItemBtn]: true,
                [$style.disabled]: data.goodsInfo.activityInfo.status !== 1
            }">
                <span>抢</span>
            </div>
        </div>
    </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModuleItem } from '../../../../utils/types'
import Countdown from '../../../Countdown.vue'
import { getPrice, getDuration } from '../../../../utils/helper'

@Component({
    components: {
        Countdown
    }
})
export default class MiaoshaItem extends Vue {
    /* props */
    @Prop(Boolean) isDefault!: boolean
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateModuleItem

    /* methods */
    getPrice = getPrice
    getDuration = getDuration
}
</script>

<style lang="scss" module>
.miaosha-list-item {
    position: relative;
    box-sizing: border-box;
    padding-top: 10px;
    height: 162px;
    &-back {
        padding: 0 4px;
        height: 100%;
        background: #A76933;
        border-radius: 6px;
    }
    &-front {
        box-sizing: border-box;
        position: relative;
        top: -10px;
        display: flex;
        padding: 15px 6px;
        height: 100%;
        background: #FFEFCC;
        border-radius: 6px;
    }
    &-bottom {
        display: flex;
        align-items: flex-end;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 63px;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/bar.png') no-repeat;
        background-size: 100%;
        box-sizing: border-box;
        padding: 0 12px 8px 0;
        z-index: 1;
    }
    &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 44px;
        background: linear-gradient(0deg, #EF1C1C 0%, #AA1C1C 100%);
        border: none;
        border-radius: 4px;
        font-size: 28px;
        color: #FFFFFF;
        &.disabled {
            background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
        }
        &::after {
            position: relative;
            top: 2px;
            content: '';
            margin-left: 8px;
            width: 11px;
            height: 17px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/thunder.png') no-repeat;
            background-size: 100%;
        }
    }
    .countdown-wrapper {
        flex: 1;
        font-size: 10px;
        color: #BA9E61;
        padding-bottom: 4px;
        .text,
        .colon {
            display: inline-block;
            padding: 0 4px;
            transform: scale(0.8);
        }
        .block {
            display: inline-block;
            box-sizing: border-box;
            padding: 0 2px;
            width: 24px;
            line-height: 23px;
            background: #FFFFFF;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #333333;
            text-align: center;
        }
    }

    .img-wrapper {
        margin-right: 7px;
        width: 120px;
        height: 80px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .info {
        position: relative;
        flex: 1;
        width: 0;
        height: 80px;
        display: flex;
        flex-direction: column;
    }
    .name {
        margin-top: 4px;
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        color: #333333;
        @include elps();
    }
    .middle {
        margin-top: 4px;
        display: flex;
        align-items: baseline;
        font-size: 14px;
        color: #A58B54;
        @include elps();
        .price {
            flex: 1;
            width: 0;
            margin-left: 2px;
            font-size: 20px;
            line-height: 27px;
            color: #D80000;
            @include elps();
            &:before {
                content: '￥';
                font-size: 16px;
            }
        }
        .original {
            font-size: 12px;
            @include elps();
        }
    }
    .progress {
        margin-top: auto;
        width: 120px;
        height: 4px;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        &-inner {
            height: 4px;
            background: #D80000;
            border-radius: 10px;
        }
    }
    .saled {
        margin-top: 4px;
        font-size: 10px;
        color: #A58B54;
    }
}

</style>
