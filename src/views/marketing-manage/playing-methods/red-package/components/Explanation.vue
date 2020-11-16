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
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
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
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 使用限制
            </h4>
            <p class="explanation-text p-l-15">
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 查看福利红包
            </h4>
            <p class="explanation-text p-l-15">
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
            </p>

            <h4 class="explanation-subtitle blue">
                2、过期与退款
            </h4>
            <h4 class="explanation-subtitle p-l-5">
                · 不与全网优惠叠加使用
            </h4>
            <p class="explanation-text p-l-15">
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 使用限制
            </h4>
            <p class="explanation-text p-l-15">
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
            </p>
            <h4 class="explanation-subtitle p-l-5">
                · 查看福利红包
            </h4>
            <p class="explanation-text p-l-15">
                设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖活动期间商品不退款，不支持线上发票仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠
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
