<template>
    <div :class="$style.miaosha">
        <div :class="$style.miaoshaTitle">
            <div :class="$style.miaoshaTitleBtn">
                查看更多
            </div>
        </div>
        <ul :class="$style.miaoshaList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.miaoshaListItem"
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
                        <div :class="$style.current">
                            秒杀价
                            <b :class="$style.price">{{ item.goodsInfo.activityInfo.activityPrice }}</b>
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <div :class="$style.original">
                                    <span v-if="item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('originalPrice')">
                                        原价：<del>{{ getPrice(item.goodsInfo.productSkuModels)('originalPrice') }}</del>
                                    </span>
                                </div>
                                <div :class="$style.progress">
                                    <div :class="$style.progressInner" :style="{ width: `${(Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)) / Number(item.goodsInfo.activityInfo.number) * 100}%` }" />
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status === 0">
                                    {{ `${item.goodsInfo.pageviews}人已关注` }}
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock > 0">
                                    {{ `已抢${Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)}件` }}
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                                    已抢完
                                </div>
                            </div>
                            <div
                                :class="{
                                    [$style.subRight]: true,
                                    [$style.disabled]: item.goodsInfo.activityInfo.status !== 1
                                }"
                            >
                                <PlSvg name="icon-qiang" width="15" height="15" />
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.miaoshaList" v-else>
            <li :class="$style.miaoshaListItem" v-for="(item, i) of 3" :key="i">
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/default.png" alt="">
                    <div :class="$style.countdownWrapper">
                        <span :class="$style.text">距开始</span>
                        <i :class="$style.block">03</i>天
                        <i :class="$style.block">23</i>:
                        <i :class="$style.block">59</i>:
                        <i :class="$style.block">59</i>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.main">
                        神奇的逻辑思维游戏畅销书
                    </div>
                    <div :class="$style.current">
                        秒杀价
                        <b :class="$style.price">10000</b>
                    </div>
                    <div :class="$style.sub">
                        <div :class="$style.subLeft">
                            <div :class="$style.original">
                                原价：
                                <del>15000</del>
                            </div>
                            <div :class="$style.progress">
                                <div :class="$style.progressInner" :style="{ width: '50%' }" />
                            </div>
                            <div :class="$style.saled">
                                已抢40件
                            </div>
                        </div>
                        <div :class="$style.subRight">
                            <PlSvg name="icon-qiang" width="15" height="15" />
                        </div>
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
import { getPrice, getDuration } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Miaosha extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getPrice = getPrice
    getDuration = getDuration
}
</script>

<style module lang="scss">
.miaosha {
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
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/title-miao-sha.png') no-repeat center;
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
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
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
        .current {
            margin-top: auto;
            font-size: 12px;
            font-weight: bold;
            color: #fe7700;
            @include elps();
            .price {
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
        .sub {
            display: flex;
            align-items: flex-end;
            &-left {
                flex: 1;
                width: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .original {
                    display: flex;
                    align-items: flex-end;
                    font-size: 10px;
                    color: #999;
                    @include elps();
                    > del {
                        &:before {
                            content: '￥';
                        }
                    }
                }
                .progress {
                    margin-top: 8px;
                    width: 115px;
                    height: 7px;
                    background: #f9dfc8;
                    border-radius: 103px;
                    overflow: hidden;
                    &-inner {
                        height: 100%;
                        background: #fe7700;
                        border-radius: 103px;
                    }
                }
                .saled {
                    font-size: 10px;
                    font-weight: 600;
                    color: #fe7700;
                }
            }
            &-right {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 28px;
                height: 28px;
                background: #fe7700;
                border-radius: 50%;
                overflow: hidden;
                color: #fff;
                &.disabled {
                    background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
                }
            }
        }
    }
}

</style>
