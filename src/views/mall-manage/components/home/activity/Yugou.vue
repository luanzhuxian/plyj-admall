<template>
    <div :class="$style.yugou">
        <div :class="$style.yugouTitle">
            <div :class="$style.yugouTitleBtn">
                查看更多
            </div>
        </div>
        <ul :class="$style.yugouList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.yugouListItem"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <div :class="$style.countdownWrapper">
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                            <Countdown
                                v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                :duration="getDuration(item.goodsInfo.activityInfo)"
                                @finish="() => item.goodsInfo.activityInfo.status += 1"
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
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.rule">
                            <span>{{ `预交定金￥${item.goodsInfo.activityInfo.price}` }}</span>
                            <span v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.multipleNumber > 1 && item.goodsInfo.activityInfo.activityPrice">{{ `抵￥${item.goodsInfo.activityInfo.activityPrice}` }}</span>
                        </div>
                        <div :class="$style.original">
                            原价：<del>{{ getPrice(item.goodsInfo.productSkuModels)('originalPrice') }}</del>
                        </div>
                        <div :class="$style.price">
                            预计到手价
                            <b>{{ getTotalPrice(item) }}</b>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.yugouList" v-else>
            <li
                v-for="(item, i) of 3"
                :key="i"
                :class="{
                    [$style.yugouListItem]: true,
                    [$style.large]: i === 0,
                    [$style.small]: i > 0
                }"
            >
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/default.png" alt="">
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
                    <div :class="$style.rule">
                        预交定金￥5000抵￥10000
                    </div>
                    <div :class="$style.original">
                        原价：<del>15000</del>
                    </div>
                    <div :class="$style.price">
                        预计到手价
                        <b>10000</b>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Countdown from '../../components/Countdown.vue'
import { getDuration, getPrice, getTotalPrice } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Yugou extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getDuration = getDuration
    getPrice = getPrice
    getTotalPrice = getTotalPrice
}
</script>

<style module lang="scss">
.yugou {
    background: #fff8eb;
    border-radius: 10px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    &-title {
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        padding-top: 46px;
        height: 76px;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/title-yu-gou.png') no-repeat center;
        background-size: 100%;
        &-btn {
            width: 111px;
            height: 19px;
            line-height: 19px;
            text-align: center;
            background: #f2b036;
            border-radius: 140px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            color: #fff;
        }
    }
    &-list {
        padding: 15px 10px 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    &-list-item {
        display: flex;
        box-sizing: border-box;
        margin-top: 10px;
        padding: 8px;
        width: 100%;
        height: 110px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        .img-wrapper {
            position: relative;
            margin-right: 8px;
            width: 140px;
            height: 94px;
            border-radius: 6px;
            overflow: hidden;
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
                background: rgba(0, 0, 0, .65);
                color: #fff;
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
            position: relative;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            box-sizing: border-box;
            padding: 2px 0;
            flex: 1;
            width: 0;
        }
        .main {
            font-size: 14px;
            font-weight: bold;
            line-height: 16px;
            color: #000;
            @include elps();
        }
        .rule {
            margin-top: 7px;
            padding: 0 5px;
            width: max-content;
            max-width: 100%;
            line-height: 19px;
            background: #fbefd7;
            font-size: 10px;
            font-family: Microsoft YaHei;
            color: #7e6e4d;
            @include elps();
        }
        .original {
            margin-top: auto;
            font-size: 10px;
            color: #999;
            @include elps();
            > del {
                &:before {
                    content: '￥';
                }
            }
        }
        .price {
            margin-top: 1px;
            font-size: 12px;
            font-weight: bold;
            color: #fe7700;
            @include elps();
            > b {
                margin-left: 2px;
                vertical-align: -1px;
                font-size: 16px;
                font-family: Microsoft YaHei;
                @include elps();
                &:before {
                    content: '￥';
                    font-size: 10px;
                }
            }
        }
    }
}

</style>
