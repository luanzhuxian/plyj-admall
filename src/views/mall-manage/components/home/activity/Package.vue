<template>
    <div :class="$style.package">
        <div :class="$style.packageTitle">
            <div :class="$style.packageTitleBtn">
                查看计划礼包
            </div>
        </div>
        <ul :class="$style.packageList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.combinationDetailList && item.combinationDetailList.length"
                    :class="{
                        [$style.packageListItem]: true,
                        [$style.large]: i === 0 || data.values.length % 2 === 0,
                        [$style.small]: i !== 0 && data.values.length % 2 === 1
                    }"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.combinationDetailList[0].imageUrl + '?x-oss-process=style/thum-middle'">
                        <div :class="$style.countdownWrapper">
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 2">已结束</span>
                            <Countdown
                                :class="$style.countdown"
                                v-if="~[0, 1].indexOf(item.combinationDetailList[0].status)"
                                :duration="getDuration(item.combinationDetailList[0])"
                                @finish="() => item.combinationDetailList[0].status += 1"
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
                            {{ item.activityName }}
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <div :class="$style.subLeftMain">
                                    <span v-if="~[1, 2].indexOf(item.combinationDetailList[0].status)">
                                        {{ `已有${item.combinationDetailList[0].salesVolume || 0}人参与` }}
                                    </span>
                                </div>
                                <div :class="$style.subLeftMiddle">
                                    原价<del>{{ `￥${item.combinationDetailList[0].totalPrice}` }}</del>
                                </div>
                                <div :class="$style.subLeftSub">
                                    组合价
                                    <b :class="$style.price">{{ item.combinationDetailList[0].discountTotalPrice }}</b>
                                </div>
                            </div>
                            <div
                                :class="{
                                    [$style.subRight]: true,
                                    [$style.disabled]: !item.combinationDetailList[0].stock || item.combinationDetailList[0].status !== 1
                                }">
                                <PlSvg name="icon-qiang" width="15" />
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.packageList" v-else>
            <li
                v-for="(item, i) of 3"
                :key="i"
                :class="{
                    [$style.packageListItem]: true,
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
                    <div :class="$style.sub">
                        <div :class="$style.subLeft">
                            <div :class="$style.subLeftMain">
                                已有1222人参与
                            </div>
                            <div :class="$style.subLeftMiddle">
                                原价<del>￥19999</del>
                            </div>
                            <div :class="$style.subLeftSub">
                                组合价
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
import Countdown from '../../Countdown.vue'
import { getDuration } from '../../../utils/helper'

@Component({
    components: { Countdown }
})
export default class Package extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getDuration = getDuration
}
</script>

<style module lang="scss">
.package {
    background: #fff8eb;
    border-radius: 10px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    &-title {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        padding-top: 46px;
        height: 76px;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/title-course-package.png') no-repeat center;
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
        margin-top: 10px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        &.large {
            padding: 8px;
            width: 100%;
            height: 110px;
            .img-wrapper {
                margin-right: 8px;
                width: 140px;
                height: 94px;
                border-radius: 6px;
            }
            .info {
                flex: 1;
                width: 0;
                height: 94px;
                .sub {
                    &-left {
                        &-main {
                            font-size: 12px;
                        }
                    }
                    &-right {
                        width: 29px;
                        height: 29px;
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
                padding: 6px;
                height: 98px;
                .sub {
                    &-left {
                        &-main {
                            font-size: 10px;
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
            .text {
              display: inline-block;
              width: 40px;
              text-align: center;
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
        }
        .main {
            margin-bottom: 4px;
            font-size: 14px;
            font-weight: bold;
            line-height: 16px;
            color: #000;
            @include elps();
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
                    color: #999;
                    @include elps();
                }
                &-middle {
                    margin-top: 4px;
                    font-size: 10px;
                    font-family: Microsoft YaHei;
                    line-height: 18px;
                    color: #fe7700;
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
