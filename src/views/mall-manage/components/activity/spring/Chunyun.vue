<template>
    <div :class="$style.chunyun" class="chunyun">
        <div :class="$style.chunyunBg">
            <div :class="$style.countdownWrapper" v-if="data.values.length">
                <span v-if="data.values[0].status === 0">距活动开始：</span>
                <span v-if="data.values[0].status === 1">距活动结束：</span>
                <span v-if="data.values[0].status === 2">活动已结束</span>
                <Countdown
                    v-if="~[0, 1].indexOf(data.values[0].status)"
                    :duration="getDuration(data.values[0])"
                    @refesh="data.values[0].status += 1"
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
            <div :class="$style.countdownWrapper" v-else>
                <span>距活动开始：</span>
                <span :class="$style.num">02</span>天<span :class="$style.num">23</span>:<span :class="$style.num">59</span>:<span :class="$style.num">59</span>
            </div>
            <p :class="$style.link">
                查看计划礼包 >
            </p>
            <PlSvg
                v-if="data.values[0] && data.values[0].quarterVersion"
                :name="`icon-${map[data.values[0].quarterVersion]}`"
                width="25"
                height="52"
            />
        </div>
        <ul
            v-if="data.values.length && data.values[0].combinationDetailList && data.values[0].combinationDetailList.length"
            :class="[$style.chunyunList, $style[size], size]"
            class="chunyun-list"
        >
            <template v-if="data.values[0].status === 0">
                <Swiper :options="getOptions(data.values[0].combinationDetailList, map1)">
                    <SwiperSlide v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
                        <li :class="$style.chunyunListItem">
                            <div :class="$style.title">
                                {{ item.name }}
                            </div>
                            <div :class="$style.imgWrapper">
                                <img :src="item.imageUrl" alt="">
                            </div>
                            <div :class="$style.price">
                                <div :class="$style.origin">
                                    {{ `原价：￥${item.totalPrice}` }}
                                </div>
                                <div :class="$style.current">
                                    {{ `组合价：￥${item.discountTotalPrice}` }}
                                </div>
                            </div>
                            <div :class="[$style.cornner, $style.topLeft]" />
                            <div :class="[$style.cornner, $style.topRight]" />
                            <div :class="[$style.cornner, $style.bottomRight]" />
                            <div :class="[$style.cornner, $style.bottomLeft]" />
                        </li>
                    </SwiperSlide>
                </Swiper>
            </template>
            <template v-if="data.values[0].status === 1">
                <Swiper :options="getOptions(item.productModelList, map2)" v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
                    <SwiperSlide>
                        <li :class="$style.chunyunListItem">
                            <div :class="$style.title">
                                {{ item.name }}
                            </div>
                            <div :class="$style.imgWrapper">
                                <img :src="item.imageUrl" alt="">
                            </div>
                            <div :class="$style.countdownWrapper">
                                <span v-if="item.status === 0">距开始</span>
                                <span v-if="item.status === 1">距结束</span>
                                <span v-if="item.status === 2">已结束</span>
                                <Countdown
                                    v-if="~[0, 1].indexOf(item.status)"
                                    :duration="getDuration(item)"
                                    @finish="item.status += 1"
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
                            <div :class="$style.price">
                                <div :class="$style.origin">
                                    <span :class="$style.left">
                                        {{ `原价：￥${item.totalPrice}` }}
                                    </span>
                                    <span :class="$style.right">
                                        {{ `${item.salesVolume}人已买` }}
                                    </span>
                                </div>
                                <div :class="$style.current">
                                    <template v-if="item.status === 2">
                                        已结束
                                    </template>
                                    <template v-else>
                                        <template v-if="item.stock">
                                            <span v-if="item.status === 0">{{ `组合价：￥${item.discountTotalPrice}` }}</span>
                                            <span v-if="item.status === 1">{{ `组合到手${item.discountTotalPrice}元` }}</span>
                                        </template>
                                        <template v-else>
                                            太火爆，已抢空
                                        </template>
                                    </template>
                                </div>
                            </div>
                            <div :class="[$style.cornner, $style.topLeft]" />
                            <div :class="[$style.cornner, $style.topRight]" />
                            <div :class="[$style.cornner, $style.bottomRight]" />
                            <div :class="[$style.cornner, $style.bottomLeft]" />
                        </li>
                    </SwiperSlide>
                    <SwiperSlide v-for="(prod, j) of item.productModelList" :key="j">
                        <li :class="$style.chunyunListProdWrapper" class="chunyun-list-prod-wrapper">
                            <div :class="$style.chunyunListProd">
                                <div :class="$style.imgWrapper">
                                    <img :src="prod.productImage" alt="">
                                </div>
                                <div :class="$style.name">
                                    {{ prod.productName }}
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
                </Swiper>
            </template>
        </ul>

        <ul :class="$style.chunyunList" v-else>
            <li :class="$style.chunyunListItem">
                <div :class="$style.title">
                    新春开学季度第一弹
                </div>
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
                </div>
                <div :class="$style.origin">
                    原价：￥1999
                </div>
                <div :class="$style.current">
                    点击购买 组合到手999元
                </div>
                <div :class="[$style.cornner, $style.topLeft]" />
                <div :class="[$style.cornner, $style.topRight]" />
                <div :class="[$style.cornner, $style.bottomRight]" />
                <div :class="[$style.cornner, $style.bottomLeft]" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Countdown from '../../components/Countdown.vue'
import { getDuration } from '../../../utils/helper'

@Component({
    components: {
        swiper,
        swiperSlide,
        Countdown
    }
})
export default class Chunyun extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: { values: { status: number; combinationDetailList: object[] }[] }

    /* data */
    map1 = Object.freeze({
        0: 1,
        1: 1,
        2: 1.2,
        3: 1.2,
        4: 1.2,
        5: 1.2,
        6: 1.2
    })

    map2 = Object.freeze({
        0: 1,
        1: 2,
        2: 2.14,
        3: 2.2,
        4: 2.25,
        5: 2.26,
        6: 2.28
    })

    map = Object.freeze({
        第一季: 'diyiji-e90f7',
        第二季: 'dierji-76655',
        第三季: 'disanji-38880',
        第四季: 'disiji-7ad77',
        第五季: 'diwuji-24755'
    })

    /* computed */
    get size () {
        const { data } = this
        let result
        if (data.values[0].status === 0) {
            if (data.values[0].combinationDetailList.length === 1) result = 'large'
            if (data.values[0].combinationDetailList.length > 1) result = 'medium'
        }
        if (data.values[0].status === 1) result = 'small'
        return result
    }

    /* methods */
    getDuration = getDuration
    getOptions (list: object[], map: { [key: number]: number }) {
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
.chunyun {
    &-list.small {
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
                &:nth-of-type(2) > .chunyun-list-prod-wrapper {
                    padding-left: 10px;
                }
                &:nth-last-of-type(1) > .chunyun-list-prod-wrapper {
                    padding-right: 10px;
                }
            }
        }
    }
}

</style>
<style lang="scss" module>
.chunyun {
    // .countdown > .time > span {
    //     padding: 0 4px;
    //     font-size: 12px;
    //     line-height: 20px;
    //     color: #96e3a9;
    // }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    &-bg {
        position: relative;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/c6bd4a18-d557-4dbd-9270-edab7a0f30b1.png') no-repeat center top;
        background-size: 100% auto;
        height: 341px;
        .countdown-wrapper {
            position: absolute;
            top: 145px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            width: 210px;
            height: 35px;
            line-height: 35px;
            font-size: 14px;
            color: #96e3a9;
            display: flex;
            justify-content: center;
            align-items: center;
            .block {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 20px;
                height: 20px;
                background: #96e3a9;
                border-radius: 3px;
                font-size: 14px;
                color: #184b28;
                margin: 0 2px;
            }
        }
        .link {
            position: absolute;
            top: 195px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 13px;
            font-family: Microsoft YaHei;
            color: #184b28;
        }
        > svg {
            position: absolute;
            top: 77px;
            right: 47px;
        }
    }
    &-list {
        padding: 0 16px 24px;
        background: #8dc607;
        &.medium {
            padding: 0 0 24px 16px;
            .chunyun-list-item {
                width: 280px;
                .img-wrapper {
                    height: 172px;
                }
            }
        }
        &.small {
            padding: 0 0 24px 16px;
            .chunyun-list-item {
                padding: 10px 8px;
                width: 172px;
                .title {
                    padding: 0 18px;
                    width: 152px;
                    height: 24px;
                    line-height: 24px;
                    font-size: 12px;
                    letter-spacing: 2px;
                }
                .img-wrapper {
                    margin-top: 10px;
                    height: 104px;
                }
                .countdown-wrapper {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 0 4px;
                    height: 31px;
                    line-height: 31px;
                    background: #397432;
                    font-size: 12px;
                    color: #92f4c7;
                    .block {
                        display: inline-block;
                        box-sizing: border-box;
                        margin: 0 2px;
                        width: 18px;
                        height: 19px;
                        line-height: 19px;
                        text-align: center;
                        background-color: #92F4C7;
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
                    .left {
                        @include elps();
                    }
                    .right {
                        font-size: 10px;
                        color: #92f4c7;
                        @include elps();
                    }
                }
                .current {
                    max-width: none;
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    font-family: San Francisco Display;
                    @include elps();
                }
                .cornner {
                    width: 15px;
                    height: 15px;
                }
            }
            .chunyun-list-prod-wrapper {
                display: flex;
                align-items: center;
                padding: 0 4px;
                height: 220px;
                background: #749529;
            }
            .chunyun-list-prod {
                box-sizing: border-box;
                padding: 6px;
                width: 140px;
                height: 165px;
                background: #bfe36a;
                .img-wrapper {
                    height: 86px;
                }
                .name {
                    padding: 0 6px;
                    height: 22px;
                    line-height: 22px;
                    background: #397432;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    color: #92f4c7;
                    text-align: center;
                    @include elps();
                }
                .origin {
                    margin-top: 6px;
                    font-size: 12px;
                    line-height: 15px;
                    color: #02684f;
                    @include elps();
                }
                .current {
                    margin-top: 3px;
                    font-size: 12px;
                    font-weight: bold;
                    line-height: 15px;
                    color: #a6482f;
                    @include elps();
                }
            }
        }
        &-item {
            position: relative;
            box-sizing: border-box;
            padding: 20px 12px 24px;
            background: #428b42;
            border: 1px solid #a3d816;
            width: 100%;
            .title {
                box-sizing: border-box;
                margin: 0 auto;
                padding: 0 35px;
                width: 223px;
                height: 32px;
                line-height: 32px;
                background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/e009100a-579a-4369-8238-db258fb2d91b.png') no-repeat center;
                background-size: auto 100%;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #dcfd8c;
                letter-spacing: 2px;
                text-align: center;
                @include elps();
            }
            .img-wrapper {
                margin-top: 16px;
                width: 100%;
                height: 213px;
                overflow: hidden;
            }
            .origin {
                margin-top: 12px;
                font-size: 18px;
                font-family: San Francisco Display;
                line-height: 21px;
                color: #fff;
                text-align: center;
                @include elps();
            }
            .current {
                margin: 6px auto 0;
                padding: 0 10px;
                max-width: fit-content;
                max-width: 100%;
                height: 45px;
                line-height: 45px;
                background: #def3ca;
                color: #a6482f;
                font-size: 22px;
                font-family: San Francisco Display;
                font-weight: bold;
                border-radius: 5px;
                text-align: center;
                @include elps();
            }
            .cornner {
                position: absolute;
                width: 23px;
                height: 23px;
                background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/1c11b4a5-091d-4f8d-a88c-e8334dfc9d88.png') no-repeat center;
                background-size: cover;
                &.top-left {
                    top: 0;
                    left: 0;
                }
                &.top-right {
                    top: 0;
                    right: 0;
                    transform: rotate(90deg);
                }
                &.bottom-left {
                    bottom: 0;
                    left: 0;
                    transform: rotate(270deg);
                }
                &.bottom-right {
                    bottom: 0;
                    right: 0;
                    transform: rotate(180deg);
                }
            }
        }
    }
}

</style>
