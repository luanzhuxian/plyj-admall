<template>
    <div :class="$style.pintuan">
        <div :class="$style.background">
            <div :class="$style.navBar">
                <div :class="$style.navLink">
                    <span>查看更多</span>
                    <i class="el-icon-arrow-right" />
                </div>
            </div>
        </div>
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="{
                        [$style.pintuanListItem]: true,
                        [$style.large]: i === 0 || data.values.length % 2 === 0,
                        [$style.small]: i !== 0 && data.values.length % 2 === 1
                    }"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img v-imgError :src="item.goodsInfo.productMainImage">
                        <div :class="$style.countdownWrapper" v-if="item.goodsInfo.activityInfo.preActivity && item.goodsInfo.activityInfo.preActivity !== 0">
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已成功</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 3">已结束</span>
                            <Countdown
                                v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                :duration="getDuration(item.goodsInfo.activityInfo)"
                                @finish="() => reset(item)"
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
                        <div :class="$style.time">
                            <div :class="$style.timeLeft">
                                <span v-if="item.goodsInfo.activityInfo.prizePool">
                                    成团瓜分
                                </span>
                                <span v-else>双十二有礼</span>
                            </div>
                            <div :class="$style.timeRight" v-if="item.goodsInfo.activityInfo.prizePool">
                                {{ `${item.goodsInfo.activityInfo.prizePool}元` }}
                            </div>
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <div :class="$style.subLeftMain">
                                    <span v-if="item.goodsInfo.activityInfo.status === 0">
                                        {{ `${item.goodsInfo.pageviews}人已关注` }}
                                    </span>
                                    <span v-else>
                                        {{ `已有${item.goodsInfo.activityInfo.number || 0}人参与` }}
                                    </span>
                                </div>
                                <div :class="$style.subLeftSub">
                                    <PlSvg name="icon-tuangoujia" width="40" height="20" />
                                    <span :class="$style.price">{{ item.goodsInfo.activityInfo.activityPrice }}</span>
                                </div>
                            </div>
                            <div :class="{
                                [$style.subRight]: true,
                                [$style.disabled]: item.goodsInfo.activityInfo.status !== 1
                            }">
                                <PlSvg
                                    v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                    name="icon-qiang"
                                    width="19"
                                />
                                <PlSvg
                                    v-else
                                    name="icon-jieshu"
                                    width="24"
                                    height="11"
                                />
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.pintuanList" v-else>
            <li
                v-for="(item, i) of 3"
                :key="i"
                :class="{
                    [$style.pintuanListItem]: true,
                    [$style.large]: i === 0,
                    [$style.small]: i > 0
                }"
            >
                <div :class="$style.imgWrapper">
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/mall-management/class/mod-popular-3.jpg" alt="">
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
                    <div :class="$style.time">
                        <div :class="$style.timeLeft">
                            成团瓜分
                        </div>
                        <div :class="$style.timeRight">
                            99999元
                        </div>
                    </div>
                    <div :class="$style.sub">
                        <div :class="$style.subLeft">
                            <div :class="$style.subLeftMain">
                                已有1222人参与
                            </div>
                            <div :class="$style.subLeftSub">
                                <PlSvg name="icon-tuangoujia" width="40" height="20" />
                                <span :class="$style.price">10000</span>
                            </div>
                        </div>
                        <div :class="$style.subRight">
                            <PlSvg name="icon-qiang" width="19" />
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
import { getDuration, reset } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Pintuan extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getDuration = getDuration
    reset = reset
}
</script>

<style module lang="scss">
.pintuan {
    background: rgba(226, 134, 67, 1);
    border-radius: 10px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .background {
        height: 226px;
        background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-pintuan.jpg') no-repeat center top;
        background-size: 100% auto;
    }
    .nav-bar {
        padding: 20px 10px 23px;
        display: flex;
        justify-content: flex-end;
    }
    .nav-link {
        width: 92px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        background: #fff;
        border-radius: 146px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 800;
        color: #f3631a;
        .el-icon-arrow-right {
            font-size: 14px;
            font-weight: bold;
        }
    }
    &-list {
        position: relative;
        top: -226px;
        padding: 70px 10px 25px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: -226px;
    }
    &-list-item {
        display: flex;
        margin-top: 10px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        &.large {
            padding: 8px;
            width: 100%;
            .img-wrapper {
                margin-right: 8px;
                width: 140px;
                height: 94px;
                border-radius: 6px;
            }
            .info {
                flex: 1;
                width: 0;
                .sub {
                    &-left {
                        &-main {
                            font-size: 12px;
                        }
                        &-sub {
                            .price {
                                font-size: 18px;
                                &:before {
                                    content: '￥';
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                    &-right {
                        width: 36px;
                        height: 36px;
                    }
                }
            }
        }
        &.small {
            flex-direction: column;
            width: 160px;
            .img-wrapper {
                height: 107px;
            }
            .info {
                padding: 8px;
                .sub {
                    &-left {
                        &-main {
                            font-size: 10px;
                        }
                        &-sub {
                            .price {
                                font-size: 16px;
                                &:before {
                                    content: '￥';
                                    font-size: 10px;
                                }
                            }
                        }
                    }
                    &-right {
                        width: 29px;
                        height: 29px;
                    }
                }
            }
        }
        .img-wrapper {
            position: relative;
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
            display: flex;
            justify-content: center;
            flex-direction: column;
            position: relative;
        }
        .main {
            margin-bottom: 4px;
            font-size: 14px;
            font-weight: bold;
            line-height: 16px;
            color: #000;
            @include elps();
        }
        .time {
            display: inline-flex;
            align-items: center;
            text-align: center;
            margin-bottom: 9px;
            width: fit-content;
            max-width: 100%;
            height: 17px;
            line-height: 15px;
            border: 1px solid #ec6ba4;
            border-radius: 2px;
            @include elps();
            &-left {
                padding: 3px;
                min-width: 52px;
                font-size: 12px;
                color: #fff;
                background: #ff6767;
                overflow: hidden;
            }
            &-right {
                flex: 1;
                padding: 0 5px;
                font-size: 12px;
                font-family: San Francisco Display;
                background: #ff0;
                color: #db4d7d;
                @include elps();
            }
        }
        .sub {
            display: flex;
            align-items: flex-end;
            &-left {
                flex: 1;
                width: 0;
                &-main {
                    margin-bottom: 2px;
                    font-weight: bold;
                    height: 18px;
                    line-height: 18px;
                    color: #999;
                    @include elps();
                }
                &-sub {
                    display: flex;
                    align-items: flex-end;
                    color: #fe3c5e;
                    @include elps();
                    .price {
                        flex: 1;
                        width: 0;
                        margin-left: 2px;
                        font-family: San Francisco Display;
                        font-weight: bold;
                        @include elps();
                        &:before {
                            content: '￥';
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                        }
                    }
                }
            }
            &-right {
                display: flex;
                justify-content: center;
                align-items: center;
                background: linear-gradient(231deg, rgba( 238, 144, 111, 1) 0%, rgba(233, 70, 115, 1) 100%);
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
