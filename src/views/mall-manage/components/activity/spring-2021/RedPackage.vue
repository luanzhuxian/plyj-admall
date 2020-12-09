<template>
    <Panel custom-class="spring-2021-red-package-panel" title="组合聚惠学">
        <template slot="title">
            <div class="spring-2021-red-package-panel-title" />
        </template>
        <template slot="default">
            <swiper :class="$style.redPackageList" :options="swiperOption" v-if="data.values.length">
                <template v-for="(item, i) of data.values">
                    <swiper-slide v-if="item.goodsInfo" :key="i">
                        <li :class="$style.redPackageListItem">
                            <div :class="$style.redPackageListItemLeft">
                                <div :class="$style.amount">
                                    <b>{{ item.goodsInfo.amount }}</b>
                                </div>
                                <p :class="$style.count">已领<span>{{ item.goodsInfo.claimVolume }}</span>张</p>
                                <p :class="$style.count">剩余<span>{{ item.goodsInfo.issueVolume }}</span>张</p>
                            </div>
                            <div :class="$style.redPackageListItemRight">
                                <b :class="$style.rule">
                                    {{ item.goodsInfo.price ? `${item.goodsInfo.price}可抵${item.goodsInfo.amount}` : `可抵${item.goodsInfo.amount}` }}
                                </b>
                                <p :class="$style.name">{{ item.goodsInfo.name }}</p>
                                <p :class="$style.time">
                                    {{ `使用时间：${formatTime(item.goodsInfo.useStartTime)}-${formatTime(item.goodsInfo.useEndTime)}` }}
                                </p>
                                <p :class="$style.link">指定商品可用 ></p>
                                <div :class="$style.bottom">
                                    <b :class="$style.price">{{ item.goodsInfo.price ? `仅需${item.goodsInfo.price}元` : '免费领取' }}</b>
                                    <button :class="$style.button">立即领取</button>
                                </div>
                            </div>
                            <div :class="$style.countdownWrapper">
                                <span :class="$style.text" v-if="item.goodsInfo.activityStatus === 0">距活动开始：</span>
                                <span :class="$style.text" v-else-if="item.goodsInfo.activityStatus === 1">距活动结束：</span>
                                <span :class="$style.text" v-else>活动已结束</span>
                                <Countdown
                                    v-if="~[0, 1].indexOf(item.goodsInfo.activityStatus)"
                                    :duration="getDuration(item.goodsInfo)"
                                    format="DD天HH:mm:ss"
                                    @finish="() => resetCountdown(item.goodsInfo)"
                                />
                            </div>
                        </li>
                    </swiper-slide>
                </template>
            </swiper>
            <swiper :class="$style.redPackageList" :options="swiperOption" v-else>
                <swiper-slide v-for="(item, i) of 3" :key="i">
                    <li :class="$style.redPackageListItem">
                        <div :class="$style.redPackageListItemLeft">
                            <div :class="$style.amount">
                                <b>200</b>
                            </div>
                            <p :class="$style.count">已领<span>122</span>张</p>
                            <p :class="$style.count">剩余<span>22</span>张</p>
                        </div>
                        <div :class="$style.redPackageListItemRight">
                            <b :class="$style.rule">满400可抵200</b>
                            <p :class="$style.name">威巴克专属福利红包</p>
                            <p :class="$style.time">使用时间：2020.11.12-2020.12.12</p>
                            <p :class="$style.link">指定商品可用 ></p>
                            <div :class="$style.bottom">
                                <b :class="$style.price">仅需1元</b>
                                <button :class="$style.button">立即领取</button>
                            </div>
                        </div>
                        <div :class="$style.countdownWrapper">
                            活动时间还剩 12天 23:59:21
                        </div>
                    </li>
                </swiper-slide>
            </swiper>
        </template>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Panel from './Panel.vue'
import Countdown from '../../Countdown.vue'
import { TemplateModule } from '../../../utils/types'
import moment from 'moment'

@Component({
    components: {
        swiper,
        swiperSlide,
        Panel,
        Countdown
    }
})
export default class Package extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    swiperOption = {
        slidesPerView: 1.1,
        spaceBetween: 10,
        grabCursor: true
    }

    /* methods */
    getDuration ({ activityStatus, receiveStartTime, receiveEndTime }: {
        activityStatus: number;
         receiveStartTime: string;
         receiveEndTime: string;
    }) {
        // 0 未开始 1 进行中 2 暂停 3 结束
        const now = Date.now().valueOf()
        if (activityStatus === 0) {
            return moment(receiveStartTime).valueOf() - now
        } else if (activityStatus === 1) {
            return moment(receiveEndTime).valueOf() - now
        }
        return 0
    }

    resetCountdown (item: any) {
        if ('goodsInfo' in item) {
            if (item.goodsInfo.activityStatus === 0) {
                item.goodsInfo.activityStatus = 1
            }
            if (item.goodsInfo.activityStatus === 1) {
                item.goodsInfo.activityStatus = 2
            }
        }
    }

    formatTime (time: string) {
        if (!time) return ''
        return time.split(' ')[0].replace(/-/g, '.')
    }
}
</script>

<style lang="scss">
.spring-2021-red-package-panel {
    .spring-2021-red-package-panel-title {
        height: 122px;
        background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/title-red-package.png) no-repeat center;
        background-size: 100%;
    }
    .spring-2021-panel-container {
        padding: 12px 0 30px;
        background: #F54540;
    }
    .spring-2021-panel-button {
        border-color: #FFC70C;
        color: #FFC70C;
    }
}
</style>

<style lang="scss" module>
.red-package-list {
    padding-left: 20px;
    &-item {
        position: relative;
        display: flex;
        box-sizing: border-box;
        padding: 16px 0 22px;
        width: 318px;
        height: 145px;
        background: #fff;
        border-radius: 6px;
        overflow: hidden;
        &-left {
            box-sizing: border-box;
            padding-left: 16px;
            width: 100px;
            .amount {
                display: flex;
                align-items: center;
                height: 55px;
                border-right: 1px solid #DDDDDD;
                > b {
                    font-size: 30px;
                    line-height: 40px;
                    color: #F54540;
                    @include elps();
                    &::before {
                        content: '¥';
                        font-size: 20px;
                        line-height: 27px;
                    }
                }
            }
            .count {
                margin-top: 4px;
                font-size: 10px;
                line-height: 14px;
                color: #999999;
                > span {
                    color: #333;
                }
            }
        }
        &-right {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            padding: 2px 12px 5px;
            .rule {
                font-size: 12px;
                line-height: 16px;
                color: #333333;
                @include elps();
            }
            .name {
                font-size: 12px;
                line-height: 16px;
                color: #05A19A;
                @include elps();
            }
            .time {
                margin-top: 4px;
                font-size: 10px;
                line-height: 14px;
                color: #999999;
                @include elps();
            }
            .link {
                font-size: 10px;
                line-height: 14px;
                color: #DDC575;
            }
            .bottom {
                margin-top: auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                color: #D80000;
            }
            .button {
                width: 80px;
                line-height: 26px;
                text-align: center;
                background: #DE302C;
                border-radius: 13px;
                font-size: 13px;
                font-family: Microsoft YaHei;
                font-weight: 600;
                color: #FFFFFF;
                border: none;
            }
        }
        .countdown-wrapper {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
            line-height: 22px;
            background: #FF9429;
            font-size: 10px;
            color: #FFFFFF;
        }
    }
}
</style>
