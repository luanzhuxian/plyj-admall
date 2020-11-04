<template>
    <Panel custom-class="yugou-panel" title="定金翻翻翻" subtitle="双十二特惠大礼来袭，定金翻倍享不停">
        <ul :class="$style.yugouList" v-if="data.values.length">
            <li :class="[$style.yugouListItem, $style.large]" v-if="isOdd">
                <div :class="$style.imgWrapper">
                    <img :src="first.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    <div :class="$style.bar">
                        <div :class="$style.rule">
                            <b v-if="first.goodsInfo.activityInfo.multiple && first.goodsInfo.activityInfo.multipleNumber > 1 && first.goodsInfo.activityInfo.activityPrice">{{ `定金${first.goodsInfo.activityInfo.price}元 抵${first.goodsInfo.activityInfo.activityPrice}元` }}</b>
                            <b v-else>{{ `预交定金${first.goodsInfo.activityInfo.price}元` }}</b>
                        </div>
                        <div :class="$style.countdownWrapper">
                            <span v-if="first.goodsInfo.activityInfo.status === 0">距开始：</span>
                            <span v-if="first.goodsInfo.activityInfo.status === 1">距结束：</span>
                            <span v-if="first.goodsInfo.activityInfo.status === 2">已结束</span>
                            <Countdown
                                v-if="~[0, 1].indexOf(first.goodsInfo.activityInfo.status)"
                                :duration="getDuration(first.goodsInfo.activityInfo)"
                                format="DD天HH:mm:ss"
                                @finish="() => first.goodsInfo.activityInfo.status += 1"
                            />
                        </div>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.name">
                        {{ first.goodsInfo.productName }}
                    </div>
                    <div :class="$style.sub">
                        <div :class="$style.price">
                            到手价：<b>{{ getTotalPrice(first) }}</b>
                        </div>
                        <del :class="$style.original">{{ `现价：¥${getPrice(first.goodsInfo.productSkuModels)('price')}` }}</del>
                        <span :class="$style.count">{{ `${first.goodsInfo.activityInfo.number}人预交` }}</span>
                    </div>
                </div>
            </li>
            <template v-for="(item, i) of (isOdd ? rest : data.values)">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="{
                        [$style.yugouListItem]: true,
                        [$style.small]: true,
                        [$style.marginT0]: !isOdd && (i === 0 || i === 1)
                    }"
                    :key="i"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div :class="$style.bar">
                        <div :class="$style.rule">
                            <b v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.multipleNumber > 1 && item.goodsInfo.activityInfo.activityPrice">{{ `定金${item.goodsInfo.activityInfo.price}元 抵${item.goodsInfo.activityInfo.activityPrice}元` }}</b>
                            <b v-else>{{ `预交定金${item.goodsInfo.activityInfo.price}元` }}</b>
                        </div>
                        <div :class="$style.countdownWrapper">
                            <span v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
                            <span v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
                            <span v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                            <Countdown
                                v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                :duration="getDuration(item.goodsInfo.activityInfo)"
                                format="DD天HH:mm:ss"
                                @finish="() => item.goodsInfo.activityInfo.status += 1"
                            />
                        </div>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.name">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.price">
                            到手价：<b>{{ getTotalPrice(item) }}</b>
                        </div>
                        <div :class="$style.sub">
                            <del :class="$style.original">{{ `现价 ¥${getPrice(item.goodsInfo.productSkuModels)('price')}` }}</del>
                            <span :class="$style.count">{{ `${item.goodsInfo.activityInfo.number}人预交` }}</span>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.yugouList" v-else>
            <li :class="[$style.yugouListItem, $style.large]">
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-blue.png" alt="">
                    <div :class="$style.bar">
                        <div :class="$style.rule">
                            <b>定金100元 抵1000元</b>
                        </div>
                        <div :class="$style.countdownWrapper">
                            距结束：2天23:59:59
                        </div>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.name">
                        李老师初中地理七年级上
                    </div>
                    <div :class="$style.sub">
                        <div :class="$style.price">
                            到手价：<b>2100</b>
                        </div>
                        <del :class="$style.original">现价：¥3000</del>
                        <span :class="$style.count">9999人预交</span>
                    </div>
                </div>
            </li>
            <li :class="[$style.yugouListItem, $style.small]" v-for="(item, i) of 2" :key="i">
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/img-placeholder-yellow.png" alt="">
                </div>
                <div :class="$style.bar">
                    <div :class="$style.rule">
                        <b>定金100元 抵1000元</b>
                    </div>
                    <div :class="$style.countdownWrapper">
                        距结束：2天23:59:59
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.name">
                        李老师初中地理七年级下
                    </div>
                    <div :class="$style.price">
                        到手价：<b>2100</b>
                    </div>
                    <div :class="$style.sub">
                        <del :class="$style.original">现价 ¥3000</del>
                        <span :class="$style.count">99人预交</span>
                    </div>
                </div>
            </li>
        </ul>
    </Panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import Panel from './Panel.vue'
import Countdown from '../../Countdown.vue'
import { getDuration, getTotalPrice, getPrice } from '../../../utils/helper'

@Component({
    components: {
        Panel,
        Countdown
    }
})
export default class Yugou extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* computed */
    get isOdd () {
        return !!(this.data.values.length % 2)
    }

    get first () {
        return this.data.values[0]
    }

    get rest () {
        return this.data.values.slice(1)
    }

    /* computed */
    getDuration = getDuration
    getTotalPrice = getTotalPrice
    getPrice = getPrice
}
</script>

<style lang="scss">
.yugou-panel {
    .double-12-panel-container {
        background-color: #F16F00;
        padding: 20px 22px;
    }
}
</style>
<style lang="scss" module>
.yugou {
    &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            &.large {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                padding: 5px;
                width: 100%;
                height: 290px;
                margin-top: 0;
                background: #ffffff;
                border-radius: 20px;
                .img-wrapper {
                    position: relative;
                    width: 100%;
                    height: 213px;
                    border-radius: 20px 20px 0 0;
                    &::before {
                        content: '';
                        position: absolute;
                        top: -4px;
                        left: 10px;
                        box-sizing: border-box;
                        padding: 6px 10px 0 0;
                        width: 68px;
                        height: 38px;
                        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/ribbon.png') no-repeat center;
                        background-size: 100%;
                    }
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 20px 20px 0 0;
                }
                .bar {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: 32px;
                    background: rgba(0, 0, 0, .6);
                    z-index: 1;
                }
                .rule {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    padding: 0 10px;
                    max-width: 175px;
                    line-height: 35px;
                    text-align: center;
                    background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
                    z-index: 2;
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        right: -12px;
                        width: 12px;
                        height: 38px;
                        background: linear-gradient(-105deg, transparent 12px, #FFEB12 13px, #FFC26F 100%);
                    }
                    > b {
                        display: block;
                        font-size: 16px;
                        color: #D00C06;
                        @include elps();
                    }
                }
                .countdown-wrapper {
                    padding: 0 10px;
                    font-size: 12px;
                    color: #FFFFFF;
                }
                .info {
                    flex: 1;
                    padding: 6px 10px;
                    .name {
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        color: #000;
                        @include elps();
                    }
                    .sub {
                        display: flex;
                        align-items: baseline;
                        margin-top: 1px;
                        font-size: 12px;
                        @include elps();
                    }
                    .price {
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        color: #D00C06;
                        @include elps();
                        > b {
                            font-size: 18px;
                            &::before {
                                content: '￥';
                                font-size: 12px;;
                            }
                        }
                    }
                    .original {
                        margin-left: 13px;
                        font-size: 12px;
                        color: #999999;
                    }
                    .count {
                        margin-left: auto;
                        color: #333333;
                    }
                }
            }
             &.small {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                width: 156px;
                height: 232px;
                margin-top: 20px;
                background: #ffffff;
                border-radius: 10px;
                &.margin-t-0 {
                    margin-top: 0;
                }
                .img-wrapper {
                    position: relative;
                    box-sizing: border-box;
                    padding: 2px 2px 0;
                    width: 100%;
                    height: 106px;
                    border-radius: 10px 10px 0 0;
                    overflow: hidden;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 10px 10px 0 0;
                }
                .bar {
                    position: relative;
                    box-sizing: border-box;
                    padding: 27px 0px 2px;
                    height: 43px;
                    background: rgba(0, 0, 0, .6);
                }
                .rule {
                    position: absolute;
                    left: 0;
                    top: -3px;
                    box-sizing: border-box;
                    padding: 0 5px;
                    width: 135px;
                    line-height: 30px;
                    text-align: center;
                    background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        right: -12px;
                        width: 12px;
                        height: 34px;
                        background: linear-gradient(-105deg, transparent 12px, #FFEB12 13px, #FFC26F 100%);
                    }
                    > b {
                        display: block;
                        font-size: 12px;
                        color: #D00C06;
                        @include elps();
                    }
                }
                .countdown-wrapper {
                    // padding-left: 13px;
                    font-size: 10px;
                    color: #FFFFFF;
                    transform: scale(0.9);
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 13px 9px 11px;
                    .name {
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        font-size: 12px;
                        color: #000;
                        @include elps();
                    }
                    .price {
                        margin-top: 1px;
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        font-size: 12px;
                        color: #D00C06;
                        @include elps();
                        > b {
                            font-size: 18px;
                            &::before {
                                content: '￥';
                                font-size: 12px;;
                            }
                        }
                    }
                    .sub {
                        margin-top: auto;
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        @include elps();
                    }
                    .original {
                        font-size: 12px;
                        color: #999999;
                    }
                    .count {
                        margin-left: auto;
                        color: #333333;
                    }
                }
            }
        }
    }
}

</style>
