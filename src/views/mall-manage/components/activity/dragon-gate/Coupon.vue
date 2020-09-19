<template>
    <div class="coupon">
        <div class="bg">
            <ul class="coupon-list" :class="{ large: data.values.length === 1 }" v-if="data.values.length">
                <template v-for="(item, i) of data.values">
                    <li
                        v-if="item.goodsInfo"
                        class="coupon-list-item"
                        :key="i"
                    >
                        <div class="coupon-list-item__top">
                            <div class="price" v-text="item.goodsInfo.amount" />
                            <p class="sub">
                                {{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}
                            </p>
                        </div>
                        <div class="coupon-list-item__bottom">
                            {{ `有效期至${getDate(item.goodsInfo.useEndTime, 'MM月DD日')}` }}
                        </div>
                    </li>
                </template>
            </ul>
            <ul class="coupon-list" v-else>
                <li class="coupon-list-item" v-for="(item, i) of list" :key="i">
                    <div class="coupon-list-item__top">
                        <div class="price" v-text="item.price" />
                        <p v-text="item.rule" />
                    </div>
                    <div class="coupon-list-item__bottom" v-text="item.expire" />
                </li>
            </ul>
        </div>
        <div class="button">
            您有优惠券可领取
            <i class="el-icon-arrow-right" />
        </div>
    </div>
</template>

<script>
import { getDate } from '../../utils/helper'

export default {
    name: 'Coupon',
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
            list: [{
                price: 9999,
                rule: '无门槛',
                expire: '有效期至6月24日'
            }, {
                price: 9999,
                rule: '满5000减300',
                expire: '有效期至6月24日'
            }]
        }
    },
    methods: {
        getDate
    }
}
</script>

<style scoped lang="scss">
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
    .el-icon-arrow-right {
        font-size: 18px;
        font-weight: bold;
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
            &__top {
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
            &__bottom {
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
