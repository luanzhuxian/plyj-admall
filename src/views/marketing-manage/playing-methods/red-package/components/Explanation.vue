<template>
    <el-dialog
        class="explanation"
        :visible="show"
        title="福利红包"
        width="800px"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
    >
        <div class="explanation-content">
            <h3 class="explanation-title">
                活动介绍：
            </h3>
            <p class="explanation-text">
                【福利红包】用户可免费领取或付费领取福利红包，福利红包仅仅支持线上购买商品和课程产品时可使用（暂不支持云课堂产品的使用），满足使用条件将自动抵扣相应的支付金额，促进用户购买欲，提前锁定意向用户，提高转化率。
            </p>

            <h3 class="explanation-title">
                活动设置：
            </h3>

            <h4 class="explanation-subtitle blue">
                1、购买与使用
            </h4>
            <h4 class="explanation-subtitle p-l-5">
                · 不与全网优惠叠加使用
            </h4>
            <p class="explanation-text p-l-15">
                福利红包使用时依据设置规则选择支持或不支持与满减券、品类券、奖学金等优惠叠加使用；且福利红包本身不可叠加使用，每次消费仅支持使用一张红包
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 使用限制
            </h4>
            <p class="explanation-text p-l-15">
                不支持购买团购、预购、组合聚会学、秒杀等活动产品，不支持云课堂下所有产品
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 查看福利红包
            </h4>
            <p class="explanation-text p-l-15">
                用户可以在【我的】-【我的卡券】查看福利红包及使用记录
            </p>

            <h4 class="explanation-subtitle blue">
                2、过期与退款
            </h4>
            <h4 class="explanation-subtitle p-l-5">
                · 未消耗福利红包不支持退款
            </h4>
            <p class="explanation-text p-l-15">
                福利红包领取在使用有效期前需尽快使用，若未使用或福利红包过期，购买福利红包金额不会退回到用户的账户
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 使用限制
            </h4>
            <p class="explanation-text p-l-15">
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 福利红包不支持开具发票
            </h4>
            <p class="explanation-text p-l-15">
                购买的福利红包不支持开具发票，使用福利红包支付的产品订单减免金额部分也不支持开具发票
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 福利红包不支持提现
            </h4>
            <p class="explanation-text p-l-15">
                福利红包做为权益产品，券面金额仅可用于本平台消费，不可以提现
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 订单退款
            </h4>
            <p class="explanation-text p-l-15">
                使用福利红包抵扣的订单在发生退款时，若使用福利红包的商品全额退款，福利红包自动返回至用户的【卡券】内；若部分退款则福利红包视为损耗不予退回
            </p>
        </div>
        <div slot="footer" class="explanation-footer">
            <el-button type="primary" round @click="close">
                我知道了
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Explanation extends Vue {
    @Prop(Boolean) show!: boolean
    close () {
        this.$emit('update:show', false)
    }
}
</script>

<style lang="scss">
    .explanation {
        .el-dialog__header {
            border-bottom: 1px solid #E7E7E7;
        }
        .el-dialog__body {
            padding: 0;
            color: #333;
        }

        &-content {
            padding: 0 60px 50px;
            height: 400px;
            overflow-y: auto;
            font-size: 14px;
        }
        &-title {
            display: flex;
            align-items: center;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 10px;
        }
        &-subtitle {
            display: flex;
            align-items: center;
            font-weight: bold;
            margin-top: 30px;
        }
        &-text {
            // line-height: 28px;
            // margin-left: 12px;
        }
        &-footer {
            text-align: center;
        }
        .blue {
            color: #4F63FF;
        }
        .p-l-5 {
            padding-left: 5px;
        }
        .p-l-15 {
            padding-left: 15px;
        }
    }
</style>
