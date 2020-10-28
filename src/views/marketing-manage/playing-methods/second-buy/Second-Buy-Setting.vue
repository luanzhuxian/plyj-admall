<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="秒杀"
    >
        <div class="setting">
            <div class="setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                秒杀是一种限时限量低价的促销方式，您可对指定商品设置在限定时间内进行低价限量销售， <br>
                秒杀活动的价格和库存是独立存在，库存是将原有商品的部分库存量直接锁定，可在营销活动中引流促活用户。 <br>
                秒杀活动每次仅支持对一件商品进行设置 。 <br>
                参与秒杀活动的商品，不能与其它优惠活动同时使用，例如不可使用满减券等；<br>
                参与秒杀活动的商品，除Helper活动之外，一种商品同一时段仅可参加一种活动，不可同时参与其它营销活动；<br>
                秒杀活动结束以时间和数量购买完截止秒杀活动结束； <br>
                秒杀活动可限制购买人数。
            </p>
            <div class="setting-title">
                <div class="line" />退款说明：
            </div>
            <p>
                秒杀商品一旦支付成功后，不支持退款操作。
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
    name: 'NewcomersSetting',
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
