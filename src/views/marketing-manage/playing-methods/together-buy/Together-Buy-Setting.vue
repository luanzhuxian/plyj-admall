<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="众志成团"
    >
        <div class="setting">
            <div class="setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                拼团是一种限时低价的促销方式，您可对指定商品设置在限定时间内限制一定人数以团购价格进行低价促销；<br>
                团购活动的价格是独立存在，库存是将原有商品的部分库存量直接锁定，可在营销活动中引流促活用户；<br>
                团购活动每次仅支持对一件商品进行设置；<br>
                参与团购活动的商品，不能与其他优惠活动同时使用，例如不可使用满减券等；<br>
                参与团购活动的商品，除helper活动之外，一种商品同一时段仅可参加一种活动，不可同时参与其他营销活动；<br>
                团购结束以时间和数量购买完截止团购结束；
            </p>
            <div>*退款说明：团购商品一旦支付成功后，不支持退款操作</div>
            <div class="setting-title">
                <div class="line" />活动设置：
            </div>
            <p class="text">
                第一步    打开“营销中心”，找到“众志成团”活动<br>
                第二步    点开“创建活动”，开始创建活动；<br>
                1.活动细则，该活动细则在活动期间将在用户端显示；<br>
                2.选择适合用户，可以选择helper用户，全部用户，普通会员，选择某些分组可见；<br>
                3.选择活动商品，默认所有商品规格均有，设置活动总库存为该商品下所有规格商品的总库存，库存售罄活动完成；<br>
                4.设置限购，一个用户限制购买几个商品；<br>
                5.选择商品团购金额，团购开始后将按团购金额成团购买<br>
                6.选择活动时间，指在该时间段内，该商品将以活动价显示；<br>
                7.活动预热，设置该时间后，将在活动开始前显示该活动预告；
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
    name: 'GeneralSetting',
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
