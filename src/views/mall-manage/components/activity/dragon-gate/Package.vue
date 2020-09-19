<template>
    <panel custom-class="package-panel" :title="panelTitle">
        <ul
            v-if="data.values.length"
            class="package-list"
        >
            <template v-for="(item, i) of data.values">
                <swiper :options="getOptions(item.combinationDetailList[0].productModelList)" :key="i" v-if="item.combinationDetailList && item.combinationDetailList.length">
                    <template v-for="(combination, j) of item.combinationDetailList">
                        <swiper-slide :key="'combination-' + j">
                            <li class="package-list-item">
                                <div class="title">
                                    {{ combination.name }}
                                </div>
                                <div class="img-wrapper">
                                    <img :src="combination.imageUrl + '?x-oss-process=style/thum-middle'" alt="">
                                    <div class="count-down-wrapper">
                                        <span v-if="combination.status === 0">距开始</span>
                                        <span v-if="combination.status === 1">距结束</span>
                                        <span v-if="combination.status === 2">已结束</span>
                                        <countdown
                                            class="countdown"
                                            v-if="~[0, 1].indexOf(combination.status)"
                                            :duration="getDuration(combination)"
                                            @finish="combination.status += 1"
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
                                <div class="price">
                                    <div class="origin">
                                        <span class="left">
                                            {{ `原价：￥${combination.totalPrice}` }}
                                        </span>
                                        <span class="right">
                                            {{ `${combination.salesVolume}人已买` }}
                                        </span>
                                    </div>
                                    <div class="current">
                                        <template v-if="combination.status === 2">
                                            已结束
                                        </template>
                                        <template v-else>
                                            <template v-if="combination.stock">
                                                <span v-if="combination.status === 0">{{ `组合价：￥${combination.discountTotalPrice}` }}</span>
                                                <span v-if="combination.status === 1">{{ `组合到手：￥${combination.discountTotalPrice}` }}</span>
                                            </template>
                                            <template v-else>
                                                太火爆，已抢空
                                            </template>
                                        </template>
                                    </div>
                                </div>
                            </li>
                        </swiper-slide>
                        <swiper-slide v-for="(prod, k) of combination.productModelList" :key="'prod-' + k">
                            <li class="package-list-prod-wrapper">
                                <div class="package-list-prod">
                                    <div class="img-wrapper">
                                        <img :src="prod.productImage + '?x-oss-process=style/thum-middle'" alt="">
                                        <div class="name">
                                            {{ prod.productName }}
                                        </div>
                                    </div>
                                    <div class="origin">
                                        {{ `原价：￥${(prod.originPrice * 1000 * prod.count) / 1000}` }}
                                    </div>
                                    <div class="current">
                                        {{ `组合价：￥${(prod.price * 1000 * prod.count) / 1000}` }}
                                    </div>
                                </div>
                            </li>
                        </swiper-slide>
                    </template>
                </swiper>
            </template>
        </ul>

        <ul class="package-list" v-else>
            <swiper :options="getOptions([1, 2, 3])" v-for="(item, i) of 2" :key="i">
                <swiper-slide>
                    <li class="package-list-item">
                        <div class="title">
                            组合聚惠学
                        </div>
                        <div class="img-wrapper">
                            <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                            <div class="count-down-wrapper">
                                <span class="text">距结束</span>
                                <i class="block">02</i>天
                                <i class="block">23</i>:
                                <i class="block">59</i>:
                                <i class="block">59</i>
                            </div>
                        </div>
                        <div class="price">
                            <div class="origin">
                                <span class="left">
                                    原价:￥99999
                                </span>
                                <span class="right">
                                    999人已买
                                </span>
                            </div>
                            <div class="current">
                                组合到手:￥9999
                            </div>
                        </div>
                    </li>
                </swiper-slide>
                <swiper-slide v-for="(prod, j) of 3" :key="j">
                    <li class="package-list-prod-wrapper">
                        <div class="package-list-prod">
                            <div class="img-wrapper">
                                <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                                <div class="name">
                                    少儿英语三节名师特...
                                </div>
                            </div>
                            <div class="origin">
                                原价：￥33333
                            </div>
                            <div class="current">
                                组合价：￥3333
                            </div>
                        </div>
                    </li>
                </swiper-slide>
            </swiper>
        </ul>
    </panel>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Panel from './Panel.vue'
import Countdown from '../../components/Countdown.vue'
import { getDuration } from '../../utils/helper'

const map = {
    0: 1,
    1: 2,
    2: 2.09,
    3: 2.13,
    4: 2.16,
    5: 2.17,
    6: 2.19
}

export default {
    name: 'Package',
    components: {
        swiper,
        swiperSlide,
        Countdown,
        Panel
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
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zhjhx.png',
                width: 184,
                height: 27
            }
        }
    },
    methods: {
        getDuration,
        getOptions (list = []) {
            const length = (list && list.length) || 0
            const swiperOption = {
                slidesPerView: map[length],
                spaceBetween: 0,
                grabCursor: true
            }
            return swiperOption
        }
    }
}
</script>

<style lang="scss" scoped>
.package-panel {
    padding-right: 0;
}
.package {
    &-list {
        .swiper-container {
            margin-top: 16px;
            &:nth-of-type(1) {
                margin: 0;
            }
            > .swiper-wrapper > .swiper-slide {
                display: flex;
                align-items: center;
                width: auto !important;
                height: 254px !important;
                &:nth-of-type(1) {
                    width: auto !important;
                }
                &:nth-of-type(2) > .package-list-prod-wrapper {
                    padding-left: 10px;
                }
                &:nth-last-of-type(1) > .package-list-prod-wrapper {
                    padding-right: 10px;
                    border-right: 2px solid #222;
                }
            }
        }

        &-item {
            position: relative;
            box-sizing: border-box;
            padding: 10px 8px;
            width: 172px;
            height: 250px;
            background-color: #ffe218;
            border: 2px solid #222;
            border-radius: 10px;
            .title {
                box-sizing: border-box;
                margin: 0 auto;
                padding: 0 18px;
                width: 148px;
                line-height: 20px;
                text-align: center;
                background-color: #02489e;
                border: 2px solid #222;
                border-radius: 6px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #fff;
                letter-spacing: 2px;
                @include elps();
            }
            .img-wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                margin-top: 10px;
                width: 100%;
                height: 135px;
                border: 2px solid #222;
                border-radius: 8px;
                overflow: hidden;
                img {
                    flex: 1;
                    width: 100%;
                    height: 0;
                    object-fit: cover;
                }
            }
            .count-down-wrapper {
                display: flex;
                justify-content: space-around;
                align-items: center;
                height: 30px;
                background-color: #4076cc;
                font-size: 12px;
                color: #fff;
                .countdown {
                  display: inline-flex;
                  align-items: center;
                }
                .block {
                    display: inline-block;
                    box-sizing: border-box;
                    margin: 0 2px;
                    width: 18px;
                    height: 19px;
                    line-height: 19px;
                    text-align: center;
                    background-color: #fff;
                    color: #4076cc;
                    border-radius: 2px;
                }
            }
            .origin {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 6px;
                font-size: 12px;
                font-family: Helvetica;
                line-height: 14px;
                color: #ff341b;
                @include elps();
                .left {
                    @include elps();
                }
                .right {
                    font-size: 10px;
                    color: #e79b01;
                    @include elps();
                }
            }
            .current {
                margin: 9px auto 0;
                padding: 0 10px;
                // max-width: fit-content;
                // max-width: 100%;
                height: 30px;
                line-height: 26px;
                background: #f08b12;
                border: 2px solid #222;
                border-radius: 5px;
                color: #fff;
                font-size: 14px;
                font-family: Helvetica;
                font-weight: bold;
                text-align: center;
                @include elps();
            }
        }
        &-prod-wrapper {
            display: flex;
            align-items: center;
            padding: 0 4px;
            height: 220px;
            background-color: #f8a810;
            border: 2px solid #222;
            border-left: none;
            border-right: none;
        }
        &-prod {
            box-sizing: border-box;
            padding: 6px;
            width: 140px;
            height: 165px;
            background: #ffdf7c;
            border: 2px solid #222;
            border-radius: 8px;
            .img-wrapper {
                display: flex;
                flex-direction: column;
                height: 108px;
                border: 2px solid #222;
                border-radius: 8px;
                overflow: hidden;
                img {
                    flex: 1;
                    width: 100%;
                    height: 0;
                    object-fit: cover;
                }
            }
            .name {
                padding: 0 6px;
                height: 22px;
                line-height: 22px;
                background: #02489e;
                font-size: 12px;
                font-family: Microsoft YaHei;
                color: #fff;
                text-align: center;
                @include elps();
            }
            .origin {
                margin-top: 6px;
                font-size: 12px;
                line-height: 15px;
                color: #f28b0a;
                @include elps();
            }
            .current {
                margin-top: 3px;
                font-size: 12px;
                font-weight: bold;
                line-height: 15px;
                color: #ff341b;
                @include elps();
            }
        }
    }
}

</style>
