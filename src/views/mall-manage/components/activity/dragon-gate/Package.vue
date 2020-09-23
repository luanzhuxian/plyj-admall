<template>
    <Panel :custom-class="packagePanel" :title="panelTitle">
        <ul v-if="data.values.length" :class="$style.packageList" class="package-list">
            <template v-for="(item, i) of data.values">
                <Swiper :options="getOptions(item.combinationDetailList[0].productModelList)" :key="i" v-if="item.combinationDetailList && item.combinationDetailList.length">
                    <template v-for="(combination, j) of item.combinationDetailList">
                        <SwiperSlide :key="'combination-' + j">
                            <li :class="$style.packageListItem">
                                <div :class="$style.title">
                                    {{ combination.name }}
                                </div>
                                <div :class="$style.imgWrapper">
                                    <img :src="combination.imageUrl + '?x-oss-process=style/thum-middle'" alt="">
                                    <div :class="$style.countdownWrapper">
                                        <span v-if="combination.status === 0">距开始</span>
                                        <span v-if="combination.status === 1">距结束</span>
                                        <span v-if="combination.status === 2">已结束</span>
                                        <Countdown
                                            :class="$style.countdown"
                                            v-if="~[0, 1].indexOf(combination.status)"
                                            :duration="getDuration(combination)"
                                            @finish="combination.status += 1"
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
                                <div :class="$style.price">
                                    <div :class="$style.origin">
                                        <span :class="$style.left">
                                            {{ `原价：￥${combination.totalPrice}` }}
                                        </span>
                                        <span :class="$style.right">
                                            {{ `${combination.salesVolume}人已买` }}
                                        </span>
                                    </div>
                                    <div :class="$style.current">
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
                        </SwiperSlide>
                        <SwiperSlide v-for="(prod, k) of combination.productModelList" :key="'prod-' + k">
                            <li :class="$style.packageListProdWrapper" class="package-list-prod-wrapper">
                                <div :class="$style.packageListProd">
                                    <div :class="$style.imgWrapper">
                                        <img :src="prod.productImage + '?x-oss-process=style/thum-middle'" alt="">
                                        <div :class="$style.name">
                                            {{ prod.productName }}
                                        </div>
                                    </div>
                                    <div :class="$style.origin">
                                        {{ `原价：￥${(prod.originPrice * 1000 * prod.count) / 1000}` }}
                                    </div>
                                    <div :class="$style.current">
                                        {{ `组合价：￥${(prod.price * 1000 * prod.count) / 1000}` }}
                                    </div>
                                </div>
                            </li>
                        </SwiperSlide>
                    </template>
                </swiper>
            </template>
        </ul>

        <ul :class="$style.package-list" v-else>
            <swiper :options="getOptions([1, 2, 3])" v-for="(item, i) of 2" :key="i">
                <SwiperSlide>
                    <li :class="$style.packageListItem">
                        <div :class="$style.title">
                            组合聚惠学
                        </div>
                        <div :class="$style.imgWrapper">
                            <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                            <div :class="$style.countdownWrapper">
                                <span :class="$style.text">距结束</span>
                                <i :class="$style.block">02</i>天
                                <i :class="$style.block">23</i>:
                                <i :class="$style.block">59</i>:
                                <i :class="$style.block">59</i>
                            </div>
                        </div>
                        <div :class="$style.price">
                            <div :class="$style.origin">
                                <span :class="$style.left">
                                    原价:￥99999
                                </span>
                                <span :class="$style.right">
                                    999人已买
                                </span>
                            </div>
                            <div :class="$style.current">
                                组合到手:￥9999
                            </div>
                        </div>
                    </li>
                </SwiperSlide>
                <SwiperSlide v-for="(prod, j) of 3" :key="j">
                    <li :class="$style.packageListProdWrapper">
                        <div :class="$style.packageListProd">
                            <div :class="$style.imgWrapper">
                                <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                                <div :class="$style.name">
                                    少儿英语三节名师特...
                                </div>
                            </div>
                            <div :class="$style.origin">
                                原价：￥33333
                            </div>
                            <div :class="$style.current">
                                组合价：￥3333
                            </div>
                        </div>
                    </li>
                </SwiperSlide>
            </Swiper>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Panel from './Panel.vue'
import Countdown from '../../components/Countdown.vue'
import { getDuration } from '../../../utils/helper'

const map: { [key: number]: number } = {
    0: 1,
    1: 2,
    2: 2.09,
    3: 2.13,
    4: 2.16,
    5: 2.17,
    6: 2.19
}

@Component({
    components: {
        swiper,
        swiperSlide,
        Countdown,
        Panel
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
    panelTitle = {
        name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zhjhx.png',
        width: 184,
        height: 27
    }

    /* methods */
    getDuration = getDuration
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
</script>

<style lang="scss">
.package-list {
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
}
</style>

<style lang="scss" module>
.package-panel {
    padding-right: 0;
}
.package {
    &-list {
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
            .countdown-wrapper {
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
