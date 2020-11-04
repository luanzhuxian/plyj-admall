<template>
    <Panel custom-class="package-panel" :title="title" subtitle="双十二组合产品特惠，折扣不停歇">
        <ul :class="$style.packageList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li :class="$style.packageListItem" :key="i" v-if="item.combinationDetailList && item.combinationDetailList.length">
                    <div :class="$style.imgWrapper">
                        <img :src="item.combinationDetailList[0].imageUrl + '?x-oss-process=style/thum-middle'">
                        <div :class="$style.rule">
                            <span>活动到手价：<b>{{ item.combinationDetailList[0].discountTotalPrice }}</b></span>
                        </div>
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
                                    <span :class="[$style.colon, $style.day]">天</span>
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
                        <div :class="$style.name">
                            {{ item.activityName }}
                        </div>
                        <div :class="$style.sub">
                            <del :class="$style.original">{{ `原价 ¥${item.combinationDetailList[0].totalPrice}` }}</del>
                            <span :class="$style.count" v-if="~[1, 2].indexOf(item.combinationDetailList[0].status)">
                                {{ `已有${item.combinationDetailList[0].salesVolume || 0}人参与` }}
                            </span>
                        </div>
                        <swiper :class="$style.packageListItemProdList" :options="swiperOption">
                            <swiper-slide v-for="(prod, j) of item.combinationDetailList[0].productModelList" :key="j">
                                <li :class="$style.packageListItemProd">
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
                        <div :class="$style.packageListItemBtnWrapper">
                            <button :class="{
                                [$style.packageListItemBtn]: true,
                                [$style.disabled]: !item.combinationDetailList[0].stock || item.combinationDetailList[0].status !== 1
                            }">
                                <template v-if="item.combinationDetailList[0].status === 2">
                                    已结束
                                </template>
                                <template v-else>
                                    <template v-if="item.combinationDetailList[0].stock">
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
        </ul>
        <ul :class="$style.packageList" v-else>
            <li :class="$style.packageListItem">
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-blue.png" alt="">
                    <div :class="$style.rule">
                        <span>活动到手价：<b>2100</b></span>
                    </div>
                    <div :class="$style.countdownWrapper">
                        <span :class="$style.text">距结束</span>
                        <i :class="$style.block">02</i>
                        <span :class="[$style.colon, $style.day]">天</span>
                        <i :class="$style.block">23</i>
                        <span :class="$style.colon">:</span>
                        <i :class="$style.block">59</i>
                        <span :class="$style.colon">:</span>
                        <i :class="$style.block">59</i>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.name">
                        李老师初中地理七年级上
                    </div>
                    <div :class="$style.sub">
                        <del :class="$style.original">原价 ¥3000</del>
                        <span :class="$style.count">99人已购</span>
                    </div>
                    <swiper :class="$style.packageListItemProdList" :options="swiperOption">
                        <swiper-slide v-for="(item, i) of 3" :key="i">
                            <li :class="$style.packageListItemProd">
                                <div :class="$style.imgWrapper">
                                    <label>系列课</label>
                                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png" alt="">
                                </div>
                                <div :class="$style.info">
                                    <div :class="$style.name">
                                        李老师初中地理七年级下
                                    </div>
                                    <div :class="$style.price">
                                        组合价<b>2100</b>
                                    </div>
                                    <del :class="$style.original">原价 ¥3000</del>
                                </div>
                            </li>
                        </swiper-slide>
                    </swiper>
                    <div :class="$style.packageListItemBtnWrapper">
                        <button :class="$style.packageListItemBtn">
                            立即抢购
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Panel from './Panel.vue'
import Countdown from '../../Countdown.vue'
import { getDuration } from '../../../utils/helper'
import { TemplateModule } from '../../../utils/types'
import { ProductTypeEnum } from '@/enum/storage'

const user = namespace('user')

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
    swiperOption = {
        slidesPerView: 2.45,
        spaceBetween: 0,
        grabCursor: true
    }

    ProductType = ProductTypeEnum

    /* computed */
    @user.Getter mallUrl!: string
    get mallDomain () {
        const arr = this.mallUrl.split('/')
        return arr[arr.length - 1]
    }

    get title () {
        return this.mallDomain === 'pljs' ? '组合聚惠购' : '组合聚惠学'
    }

    /* methods */
    getDuration = getDuration
}
</script>

<style lang="scss">
.package-panel {
    .double-12-panel-container {
        margin-top: 0;
        padding: 20px 22px;
    }
}
</style>
<style lang="scss" module>
.package {
    &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 516px;
            margin-top: 20px;
            background: #ffffff;
            border-radius: 20px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
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
    }
}

</style>
