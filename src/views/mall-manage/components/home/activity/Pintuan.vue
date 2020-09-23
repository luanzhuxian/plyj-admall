<template>
    <div :class="$style.pintuan">
        <div :class="$style.pintuanTitle">
            <div :class="$style.pintuanTitleBtn">
                查看更多
            </div>
        </div>
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="{
                        [$style.pintuanListItem]: true,
                        [$style.large]: i === 0 && data.values.length % 2 === 1
                    }"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <div :class="$style.countdownWrapper">
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已成功</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 3">已结束</span>
                            <Countdown
                                :class="$style.countdown"
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
                        <div :class="$style.time" v-if="item.goodsInfo.activityInfo.prizePool">
                            <div :class="$style.timeLeft">
                                成团瓜分
                            </div>
                            <div :class="$style.timeRight">
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
                                    团购价
                                    <b :class="$style.price">{{ item.goodsInfo.activityInfo.activityPrice }}</b>
                                </div>
                            </div>
                            <div
                                :class="{
                                    [$style.subRight]: true,
                                    [$style.disabled]: item.goodsInfo.activityInfo.status !== 1
                                }">
                                <PlSvg name="icon-qiang" :width="(i === 0 && data.values.length % 2 === 1) ? 19 : 15" />
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
                                团购价
                                <b :class="$style.price">10000</b>
                            </div>
                        </div>
                        <div :class="$style.subRight">
                            <PlSvg name="icon-qiang" :width="i === 0 ? 19 : 15" />
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
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/title-pin-tuan.png') no-repeat center;
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
        flex-direction: column;
        box-sizing: border-box;
        margin-top: 10px;
        width: 160px;
        height: 205px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;

        &.large {
            margin-top: 0;
            width: 100%;
            height: 318px;
            .img-wrapper {
                width: 100%;
                height: 222px;
                .countdown-wrapper {
                    display: flex;
                    justify-content: center;
                    height: 40px;
                    font-size: 16px;
                }
                .text {
                    display: inline-block;
                    width: auto;
                    text-align: center;
                }
                .countdown {
                    justify-content: center;
                    flex: none;
                }
                .block {
                    margin: 0 4px;
                    padding: 0 3px;
                    height: 20px;
                    line-height: 20px;
                }
            }
            .info {
                padding-bottom: 10px;
                .sub {
                    &-right {
                        width: 39px;
                        height: 39px;
                    }
                }
            }
        }
        .img-wrapper {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 107px;
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
            .text {
                width: auto;
                padding: 0 2px;
            }
            .countdown {
                display: inline-flex;
                justify-content: space-around;
                flex: 1;
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
            padding: 6px 8px;
            flex: 1;
            height: 0;
        }
        .main {
            font-size: 14px;
            font-weight: bold;
            line-height: 19px;
            color: #000;
            @include elps();
        }
        .time {
            display: inline-flex;
            align-items: center;
            text-align: center;
            margin-top: 6px;
            width: fit-content;
            max-width: 100%;
            height: 19px;
            line-height: 19px;
            border: 1px solid #ff772b;
            border-radius: 2px;
            @include elps();
            &-left {
                padding: 3px;
                min-width: 52px;
                font-size: 12px;
                color: #fff;
                background: #ff772b;
                overflow: hidden;
            }
            &-right {
                flex: 1;
                padding: 0 5px;
                font-size: 12px;
                font-family: San Francisco Display;
                background: #fff48e;
                color: #ff772b;
                @include elps();
            }
        }
        .sub {
            display: flex;
            align-items: flex-end;
            margin-top: auto;
            &-left {
                flex: 1;
                width: 0;
                &-main {
                    font-weight: bold;
                    height: 18px;
                    line-height: 18px;
                    font-size: 10px;
                    color: #999;
                    @include elps();
                }
                &-sub {
                    font-size: 12px;
                    font-weight: bold;
                    color: #fe7700;
                    @include elps();
                    .price {
                        vertical-align: -1px;
                        font-size: 16px;
                        @include elps();
                        &:before {
                            content: '￥';
                            font-size: 10px;
                        }
                    }
                }
            }
            &-right {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 29px;
                height: 29px;
                background-color: #fe7700;
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
