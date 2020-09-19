<template>
    <panel custom-class="miaosha-panel" :title="panelTitle">
        <ul class="miaosha-list" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    class="miaosha-list-item"
                    :key="index"
                >
                    <div class="img-wrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <div class="count-down-wrapper">
                            <span class="text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                            <span class="text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                            <span class="text" v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                            <countdown
                                v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                :duration="getDuration(item.goodsInfo.activityInfo)"
                                @finish="() => item.goodsInfo.activityInfo.status += 1"
                            >
                                <template #default="{time}">
                                    <i class="block">{{ String(time.days).padStart(2, '0') }}</i>
                                    <span class="colon">天</span>
                                    <i class="block">{{ String(time.hours).padStart(2, '0') }}</i>
                                    <span class="colon">:</span>
                                    <i class="block">{{ String(time.minutes).padStart(2, '0') }}</i>
                                    <span class="colon">:</span>
                                    <i class="block">{{ String(time.seconds).padStart(2, '0') }}</i>
                                </template>
                            </countdown>
                        </div>
                    </div>
                    <div class="info">
                        <div class="main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div class="current">
                            <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/msj.png" width="30" />
                            <span class="price">{{ item.goodsInfo.activityInfo.activityPrice }}</span>
                        </div>
                        <div class="sub">
                            <div class="sub-left">
                                <div class="original">
                                    <span v-if="item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('originalPrice')">
                                        原价:<span class="price">{{ getPrice(item.goodsInfo.productSkuModels)('originalPrice') }}</span>
                                    </span>
                                </div>
                                <div class="progress">
                                    <div class="progress-inner" :style="{ width: `${(Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)) / Number(item.goodsInfo.activityInfo.number) * 100}%` }" />
                                </div>
                                <div class="saled" v-if="item.goodsInfo.activityInfo.status === 0">
                                    {{ `${item.goodsInfo.pageviews}人已关注` }}
                                </div>
                                <div class="saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock > 0">
                                    {{ `已抢${Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)}件` }}
                                </div>
                                <div class="saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                                    已抢完
                                </div>
                            </div>
                            <div class="sub-right" :class="{ disabled: item.goodsInfo.activityInfo.status !== 1 }">
                                <PlSvg name="icon-qiang" width="19" height="19" />
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul class="miaosha-list" v-else>
            <li class="miaosha-list-item" v-for="(item, i) of 2" :key="i">
                <div class="img-wrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/default.png" alt="">
                    <div class="count-down-wrapper">
                        <span class="text">距开始</span>
                        <i class="block">02</i>天
                        <i class="block">23</i>:
                        <i class="block">59</i>:
                        <i class="block">59</i>
                    </div>
                </div>
                <div class="info">
                    <div class="main">
                        神奇的逻辑思维游戏畅销书
                    </div>
                    <div class="current">
                        <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/msj.png" width="30" />
                        <span class="price">10000</span>
                    </div>
                    <div class="sub">
                        <div class="sub-left">
                            <div class="original">
                                原价:
                                <span class="price">15000</span>
                            </div>
                            <div class="progress">
                                <div class="progress-inner" :style="{ width: '50%' }" />
                            </div>
                            <div class="saled">
                                已抢40件
                            </div>
                        </div>
                        <div class="sub-right">
                            <PlSvg name="icon-qiang" width="19" height="19" />
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </panel>
</template>

<script>
import Panel from './Panel.vue'
import Countdown from '../../components/Countdown.vue'
import { getPrice, getDuration } from '../../utils/helper'

export default {
    name: 'Miaosha',
    components: {
        Panel,
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {
            panelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/xsms.png',
                width: 163,
                height: 27
            }
        }
    },
    methods: {
        getPrice,
        getDuration
    }
}
</script>

<style scoped lang="scss">
.miaosha {
    &-list-item {
        display: flex;
        box-sizing: border-box;
        margin-top: 10px;
        padding: 8px;
        width: 100%;
        background-color: #ffe701;
        border: 2px solid rgba(34, 34, 34, 1);
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
            border: 2px solid rgba(34, 34, 34, 1);
            border-radius: 6px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .count-down-wrapper {
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
            flex: 1;
            width: 0;
            display: flex;
            justify-content: center;
            flex-direction: column;
        }
        .main {
            font-size: 14px;
            font-weight: bold;
            line-height: 20px;
            color: #000;
            @include elps();
        }
        .current {
            margin-bottom: 1px;
            display: flex;
            align-items: baseline;
            color: #ff341b;
            @include elps();
            .price {
                flex: 1;
                width: 0;
                margin-left: 2px;
                font-size: 20px;
                font-family: San Francisco Display;
                font-weight: bold;
                @include elps();
                &:before {
                    content: '￥';
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
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
                    margin-bottom: 7px;
                    height: 16px;
                    font-size: 10px;
                    color: #f08918;
                    @include elps();
                    .price {
                        flex: 1;
                        width: 0;
                        font-family: San Francisco Display;
                        text-decoration: line-through;
                        @include elps();
                        &:before {
                            content: '￥';
                            font-family: Microsoft YaHei;
                        }
                    }
                }
                .progress {
                    width: 115px;
                    height: 7px;
                    background: #fff;
                    border-radius: 103px;
                    overflow: hidden;
                    &-inner {
                        height: 7px;
                        background: #ff341b;
                        border-radius: 103px;
                    }
                }
                .saled {
                    font-size: 10px;
                    font-weight: 600;
                    color: #ff341b;
                }
            }
            &-right {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 36px;
                background: #ff341b;
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
