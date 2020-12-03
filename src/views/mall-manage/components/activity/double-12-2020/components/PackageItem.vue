<template>
    <li :class="$style.packageItem" v-if="data.combinationDetailList && data.combinationDetailList.length">
        <div :class="$style.imgWrapper">
            <img :src="data.combinationDetailList[0].imageUrl + '?x-oss-process=style/thum-middle'">
            <div :class="$style.rule">
                <span>活动到手价：<b>{{ data.combinationDetailList[0].discountTotalPrice }}</b></span>
            </div>
            <div :class="$style.countdownWrapper">
                <span :class="$style.text" v-if="data.combinationDetailList[0].status === 0">距开始</span>
                <span :class="$style.text" v-if="data.combinationDetailList[0].status === 1">距结束</span>
                <span :class="$style.text" v-if="data.combinationDetailList[0].status === 2">已结束</span>
                <slot name="countdown">
                    <Countdown
                        :class="$style.countdown"
                        v-if="~[0, 1].indexOf(data.combinationDetailList[0].status)"
                        :duration="getDuration(data.combinationDetailList[0])"
                        @finish="() => data.combinationDetailList[0].status += 1"
                    >
                        <template #default="{time}">
                            <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                            <span :class="[$style.colon, $style.day]">天</span>
                            <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                            <span :class="$style.colon">:</span>
                            <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                            <span :class="$style.colon">:</span>
                            <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                        </template>
                    </Countdown>
                </slot>
            </div>
        </div>
        <div :class="$style.info">
            <div :class="$style.name">
                {{ data.activityName }}
            </div>
            <div :class="$style.sub">
                <del :class="$style.original">{{ `原价 ¥${data.combinationDetailList[0].totalPrice}` }}</del>
                <span :class="$style.count" v-if="~[1, 2].indexOf(data.combinationDetailList[0].status)">
                    {{ `已有${data.combinationDetailList[0].salesVolume || 0}人参与` }}
                </span>
            </div>
            <swiper :class="$style.packageItemProdList" :options="swiperOption">
                <swiper-slide v-for="(prod, j) of data.combinationDetailList[0].productModelList" :key="j">
                    <li :class="$style.packageItemProd">
                        <div :class="$style.imgWrapper">
                            <label v-if="prod.productType">{{ ProductType[prod.productType] }}</label>
                            <img :src="prod.productImage + '?x-oss-process=style/thum-middle'" alt="">
                        </div>
                        <div :class="$style.info">
                            <div :class="$style.name">
                                {{ prod.productName }}
                            </div>
                            <div :class="$style.price">
                                组合价<b>{{ (prod.price * 1000 * prod.count) / 1000 }}</b>
                            </div>
                            <del :class="$style.original">{{ `原价 ¥${(prod.originPrice * 1000 * prod.count) / 1000}` }}</del>
                        </div>
                    </li>
                </swiper-slide>
            </swiper>
            <div :class="$style.packageItemBtnWrapper">
                <button
                    class="package-item-btn"
                    :class="{
                        [$style.packageItemBtn]: true,
                        [$style.disabled]: !data.combinationDetailList[0].stock || data.combinationDetailList[0].status !== 1
                    }"
                >
                    <template v-if="data.combinationDetailList[0].status === 2">
                        已结束
                    </template>
                    <template v-else>
                        <template v-if="data.combinationDetailList[0].stock">
                            立即抢购
                        </template>
                        <template v-else>
                            太火爆，已抢空
                        </template>
                    </template>
                </button>
            </div>
        </div>
    </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModuleItem } from '../../../../utils/types'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Countdown from '../../../Countdown.vue'
import { getDuration } from '../../../../utils/helper'
import { ProductTypeEnum } from '@/enum/storage'

@Component({
    components: {
        swiper,
        swiperSlide,
        Countdown
    }
})
export default class PackageItem extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateModuleItem

    /* data */
    swiperOption = {
        slidesPerView: 2.45,
        spaceBetween: 0,
        grabCursor: true
    }

    ProductType = ProductTypeEnum

    /* methods */
    getDuration = getDuration
}
</script>

<style lang="scss" module>
.package-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 516px;
    background: #ffffff;
    border-radius: 20px;
    > .img-wrapper {
        position: relative;
        box-sizing: border-box;
        padding: 5px 5px 0;
        width: 100%;
        height: 218px;
        border-radius: 20px 20px 0 0;
        overflow: hidden;
        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px 20px 0 0;
        }
    }
    .rule {
        position: absolute;
        left: 5px;
        bottom: 42px;
        padding: 0 10px;
        max-width: 215px;
        line-height: 35px;
        text-align: center;
        font-family: Microsoft YaHei;
        font-weight: 600;
        font-size: 14px;
        color: #D00C06;
        background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
        z-index: 1;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: -12px;
            width: 12px;
            height: 38px;
            background: linear-gradient(-105deg, transparent 12px, #FFEB12 13px, #FFC26F 100%);
        }
        > span {
            display: block;
            @include elps();
            > b {
                font-size: 18px;
                &::before {
                    content: '￥';
                    font-size: 14px;
                }
            }
        }
    }
    .countdown-wrapper {
        position: absolute;
        left: 5px;
        right: 5px;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 42px;
        background: linear-gradient(90deg, #FFD371 0%, #F78E13 100%);
        z-index: 1;
        font-size: 10px;
        font-family: Microsoft YaHei;
        font-weight: 600;
        color: #FFFFFF;
            .text {
                font-size: 12px;
            }
            .text,
            .colon {
                display: inline-block;
                padding: 0 4px;
            }
            .day {
                margin-right: 10px;
            }
            .block {
                display: inline-block;
                box-sizing: border-box;
                padding: 0 2px;
                width: 24px;
                line-height: 23px;
                background: #FFFFFF;
                font-size: 14px;
                color: #333333;
                text-align: center;
            }
    }
    > .info {
        flex: 1;
        padding: 10px 0 10px 14px;
        .name {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #000;
            @include elps();
        }
        .sub {
            display: flex;
            align-items: center;
            margin-top: 3px;
            @include elps();
        }
        .original {
            font-size: 14px;
            color: #999999;
        }
        .count {
            margin-left: 39px;
            font-size: 12px;
            color:#666666;
        }
    }
    &-prod-list {
        margin-top: 20px;
    }
    &-prod {
        display: flex;
        flex-direction: column;
        width: 120px;
        height: 155px;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        > .img-wrapper {
            position: relative;
            height: 80px;
            overflow: hidden;
            > label {
                position: absolute;
                top: 4px;
                left: 4px;
                padding: 0 7px;
                line-height: 16px;
                text-align: center;
                background: #333333;
                opacity: 0.7;
                border-radius: 8px;
                font-size: 10px;
                color: #FFFFFF;
            }
            > img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        > .info {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 8px 0;
            .name {
                font-weight: bold;
                font-size: 13px;
                color: #333;
                @include elps();
            }
            .price {
                margin-top: 2px;
                font-family: Microsoft YaHei;
                font-weight: 600;
                font-size: 12px;
                color: #D00C06;
                @include elps();
                > b {
                    font-size: 14px;
                    &::before {
                        content: '￥';
                        font-size: 12px;;
                    }
                }
            }
            .original {
                margin-top: 4px;
                font-size: 12px;
                color: #999999;
            }
        }
    }
    &-btn-wrapper {
        margin-top: 10px;
        padding-right: 14px;
    }
    &-btn {
        width: 100%;
        line-height: 40px;
        text-align: center;
        background: linear-gradient(180deg, #D80000 0%, #EA6504 100%);
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 600;
        color: #FFFFFF;
        &.disabled {
            background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
        }
    }
}
</style>
