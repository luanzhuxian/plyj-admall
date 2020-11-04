<template>
    <div :class="$style.coupon">
        <div :class="$style.couponTitle">
            <h3>领券不停，福利多多</h3>
            <span>·  更多优惠——快来领取  ·</span>
        </div>
        <ul :class="$style.couponList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo"
                    :class="$style.couponListItem"
                    :key="i"
                >
                    <div :class="$style.couponListItemName">
                        {{ item.goodsInfo.couponName }}
                    </div>
                    <div :class="$style.couponListItemLeft">
                        <b :class="$style.price" v-text="item.goodsInfo.amount" />
                    </div>
                    <div :class="$style.couponListItemMiddle">
                        <p :class="$style.rule">
                            {{ `满${item.goodsInfo.useLimitAmount}` }}
                        </p>
                        <p :class="$style.rule">
                            {{ `减${item.goodsInfo.amount}` }}
                        </p>
                    </div>
                    <button :class="$style.couponListItemBtn">
                        立即抢券
                    </button>
                </li>
            </template>
        </ul>
        <ul :class="$style.couponList" v-else>
            <li :class="$style.couponListItem" v-for="(item, i) of list" :key="i">
                <div :class="$style.couponListItemName">
                    双十二特惠券
                </div>
                <div :class="$style.couponListItemLeft">
                    <b :class="$style.price" v-text="item.price" />
                </div>
                <div :class="$style.couponListItemMiddle">
                    <p :class="$style.rule" v-text="item.limit" />
                    <p :class="$style.rule" v-text="item.amount" />
                </div>
                <button :class="$style.couponListItemBtn">
                    立即抢券
                </button>
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

    /* data */
    list = Object.freeze([{
        price: 500,
        limit: '满2000',
        amount: '减500'
    }, {
        price: 300,
        limit: '满1000',
        amount: '减300'
    }, {
        price: 50,
        limit: '满300',
        amount: '减50'
    }])

    /* methods */
    getDate = getDate
}
</script>

<style lang="scss" module>
.coupon {
    position: relative;
    padding: 0 20px 12px;
    background: #FFFBF1;
    border-radius: 10px;
    &::before {
        content: '';
        position: absolute;
        top: 57px;
        left: -6px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #DB451B;
    }
    &::after {
        content: '';
        position: absolute;
        top: 57px;
        right: -6px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #DB451B;
    }
    &-title {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        border-bottom: 2px solid #F0CEAC;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/logo-large.png') no-repeat center bottom;
        background-size: 226px 60px;
        > h3 {
            font-size: 20px;
            line-height: 27px;
            color: #D80000;
        }
        > span {
            padding-bottom: 7px;
            font-size: 10px;
            line-height: 14px;
            color: #BA9E61;
        }
    }
    &-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-wrap: nowrap;
        padding: 17px 0;
        &-item {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            margin-top: 10px;
            padding: 0 12px;
            width: 100%;
            height: 71px;
            background: linear-gradient(176deg, #FFEFCC 0%, #EDCC86 76%, #FFDD95 100%);
            border-radius: 6px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
            &-name {
                position: absolute;
                top: 7px;
                left: -4px;
                box-sizing: border-box;
                padding: 0 8px 0 4px;
                width: 96px;
                line-height: 16px;
                text-align: center;
                background: #D80000;
                font-size: 10px;
                color: #E7C06D;
                @include elps();
                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-left: 4px solid transparent;
                    border-right: 4px solid #F8E8C5;
                    border-bottom: 8px solid transparent;

                }
            }
            &-left {
                position: relative;
                top: 2px;
                flex: 1;
                @include elps();
                > .price {
                    font-size: 30px;
                    line-height: 40px;
                    color: #D80000;
                    &:before {
                        content: '￥';
                        font-size: 20px;
                        line-height: 27px;
                    }
                }
            }
            &-middle {
                width: 88px;
                @include elps();
                .rule {
                    font-size: 14px;
                    line-height: 19px;
                    color: #A58B54;
                    @include elps();
                }
            }
            &-btn {
                margin-left: 4px;
                width: 80px;
                height: 27px;
                line-height: 27px;
                text-align: center;
                background: #D80000;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                color: #FFFFFF;
            }
        }
    }
}

</style>
