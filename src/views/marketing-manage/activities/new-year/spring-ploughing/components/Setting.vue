<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="兑换码"
    >
        <div class="setting">
            <div class="setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                1. 设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖<br>
                2. 活动期间商品不退款，不支持线上发票<br>
                3. 仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠<br>
                4. 结束以时间和数量购买完截止结束
            </p>
            <div class="setting-title">
                <div class="line" />活动设置：
            </div>
            <p class="text">
                第一步    打开“营销中心”，找到“新春开学大礼包”活动<br>
                第二步    点开“创建活动”，开始创建活动<br>
                1.活动细则，该活动细则在活动期间将在用户端显示<br>
                2.选择适合用户，可以选择helper用户，全部用户，选择某些分组可见；<br>
                3.选择活动商品，默认所有商品规格均参加；设置活动下每个商品的可购买数量，该数量组合下单不可修改；组合折扣将以折扣形式减免支付<br>
                4.设置活动下的组合库存，该库存售罄活动完成；<br>
                5.活动可添加买后获得礼品的奖励，只要买了该组合商品加送礼品，设置的奖品各一份<br>
                6.选择活动时间，指在该时间段内，该商品在该页面组合购买以折扣价存在<br>
                7.活动预热，设置该时间后，将在活动开始前显示该活动预告
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button round type="primary" @click="close">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'Setting',
    props: {
        show: Boolean
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #E7E7E7;
    }
    .setting {
        height: 300px;
        overflow-y: auto;
        padding: 0 4px;
        font-size: 14px;
        .tips {
            font-weight: bold;
            margin-top: 30px;
            line-height: 28px;
        }
        .setting-title {
            display: flex;
            align-items: center;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 10px;
            .line{
                width: 2px;
                height: 12px;
                background: #4F63FF;
                margin-right: 10px;
            }
        }
        .text {
            line-height: 28px;
            margin-left: 12px;
            .blue{
                color: #4F63FF;
            }
        }
    }
</style>
