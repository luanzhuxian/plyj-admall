<template>
    <div :class="$style.coupon">
        <div :class="$style.couponTitle">
            <div :class="$style.couponTitleLeft">
                <PlSvg name="icon-speaker-57132" width="13" style="margin-right: 3px;" />
                您有优惠券可使用！
            </div>
            <div :class="$style.couponTitleRight">
                立即领取
                <PlSvg name="icon-you" width="14" />
            </div>
        </div>
        <ul :class="$style.couponList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo"
                    :class="{
                        [$style.couponListItem]: true,
                        [$style.large]: data.values.length === 1,
                        [$style.medium]: data.values.length === 2,
                        [$style.small]: data.values.length === 3
                    }"
                    :key="i"
                >
                    <div :class="$style.couponListItemWrapper">
                        <div :class="$style.price">
                            ￥<span :class="$style.number">{{ item.goodsInfo.amount }}</span>
                        </div>
                        <div :class="$style.rule">
                            {{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}
                        </div>
                        <div :class="$style.date">
                            <span>{{ `${getDate(item.goodsInfo.useStartTime, 'MM/DD')}-${getDate(item.goodsInfo.useEndTime, 'MM/DD')}` }}</span>
                        </div>
                    </div>
                    <div :class="$style.couponListItemCover">
                        立即领取
                    </div>
                </li>
            </template>
        </ul>
        <ul :class="$style.couponList" v-else>
            <li :class="[$style.couponListItem, $style.small]" v-for="(item, i) of 3" :key="i">
                <div :class="$style.couponListItemWrapper">
                    <div :class="$style.price">
                        ￥<span :class="$style.number">30</span>
                    </div>
                    <div :class="$style.rule">
                        无门槛
                    </div>
                    <div :class="$style.date">
                        4/15-4/30
                    </div>
                </div>
                <div :class="$style.couponListItemCover">
                    立即领取
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../../utils/types'
import { getDate } from '../../../utils/helper'

@Component
export default class Coupon extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* methods */
    getDate = getDate
}
</script>

<style module lang="scss">
.coupon {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .05);
    overflow: hidden;
    &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        font-size: 12px;
        line-height: 32px;
        background: #fbefd7;
        color: #7e6e4d;
        &-left {
            font-size: 13px;
            font-family: Microsoft YaHei;
            color: #ff8533;
            letter-spacing: 1px;
        }
    }
    &-list {
        display: flex;
        justify-content: space-around;
        padding: 12px 6px 20px;
        &-item {
            position: relative;
            box-sizing: border-box;
            padding: 5px;
            width: 107px;
            // height: 62px;
            font-size: 10px;
            color: #f34436;
            background-color: #fbefd7;
            border-radius: 5px;
            &.large {
                width: 285px;
                font-size: 14px;
                .coupon-list-item-wrapper {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding-right: 22px;
                    height: 71px;
                }
                .price {
                    margin-right: 3px;
                    font-size: 24px;
                }
                .number {
                    font-size: 38px;
                }
            }
            &.medium {
                width: 160px;
                .coupon-list-item-wrapper {
                    padding-right: 22px;
                    height: 71px;
                }
                .price {
                    font-size: 15px;
                }
                .number {
                    font-size: 22px;
                }
            }
            &-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 3px 6px 5px;
                height: 100%;
                border: 1px solid #f29e5e;
                border-style: dashed;
                border-radius: 5px;
            }
            &-cover {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 8px;
                width: 27px;
                background: #f6ce9a;
                border-radius: 0 5px 5px 0;
                font-size: 9px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                line-height: 14px;
                color: #f34436;
            }
            .price {
                font-size: 12px;
                margin-right: 3px;
                @include elps();
            }
            .rule {
                @include elps-wrap(2);
            }
            .number {
                font-size: 16px;
                font-family: San Francisco Display;
                font-weight: bold;
            }
            .date {
                margin-top: auto;
                font-family: San Francisco Display;
                @include elps();
            }
        }
    }
}

</style>
