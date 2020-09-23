<template>
    <div :class="$style.coupon">
        <div :class="$style.bg">
            <ul
                :class="{
                    [$style.couponList]: true,
                    [$style.large]: data.values.length === 1
                }"
                v-if="data.values.length"
            >
                <template v-for="(item, i) of data.values">
                    <li
                        v-if="item.goodsInfo"
                        :class="$style.couponListItem"
                        :key="i"
                    >
                        <div :class="$style.couponListItemTop">
                            <div :class="$style.price" v-text="item.goodsInfo.amount" />
                            <p :class="$style.sub">
                                {{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}
                            </p>
                        </div>
                        <div :class="$style.couponListItemBottom">
                            {{ `有效期至${getDate(item.goodsInfo.useEndTime, 'MM月DD日')}` }}
                        </div>
                    </li>
                </template>
            </ul>
            <ul :class="$style.couponList" v-else>
                <li :class="$style.couponListItem" v-for="(item, i) of list" :key="i">
                    <div :class="$style.couponListItemTop">
                        <div :class="$style.price" v-text="item.price" />
                        <p v-text="item.rule" />
                    </div>
                    <div :class="$style.couponListItemBottom" v-text="item.expire" />
                </li>
            </ul>
        </div>
        <div :class="$style.button">
            您有优惠券可领取
            <i class="el-icon-arrow-right" style="font-size: 18px; font-weight: bold;" />
        </div>
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

    /* data */
    list = Object.freeze([{
        price: 9999,
        rule: '无门槛',
        expire: '有效期至6月24日'
    }, {
        price: 9999,
        rule: '满5000减300',
        expire: '有效期至6月24日'
    }])

    /* methods */
    getDate = getDate
}
</script>

<style module lang="scss">
.coupon {
    .bg {
        box-sizing: border-box;
        height: 206px;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/coupon-bg.png') no-repeat center top;
        background-size: 100%;
    }
    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 12px auto 0;
        width: 257px;
        height: 54px;
        line-height: 54px;
        background: #ffe31a;
        border: 1px solid #707070;
        border-radius: 55px;
        font-size: 22px;
        font-weight: bold;
        color: #00237a;
    }
    &-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        padding: 82px 28px 0;
        &.large {
            justify-content: center;
            .coupon-list-item {
                width: 183px;
                background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/coupon-large.png') no-repeat center;
                background-size: 100%;
            }
        }
        &-item {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding-right: 11px;
            width: 154px;
            height: 87px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/coupon-small.png') no-repeat center;
            background-size: 100%;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 13px;
            color: #b4e1f2;
            &-top {
                flex: 1;
                height: 0;
                padding: 12px 30px 0 7px;
                > .price {
                    margin-bottom: 2px;
                    font-size: 28px;
                    line-height: 21px;
                    color: #ffe31a;
                    @include elps();
                    &:before {
                        content: '￥';
                        font-size: 12px;
                    }
                }
                > p {
                    @include elps();
                }
            }
            &-bottom {
                height: 22px;
                line-height: 22px;
                text-align: center;
                font-size: 12px;
                color: #00237a;
            }
        }
    }
}

</style>
