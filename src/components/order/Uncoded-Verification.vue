<template>
    <div>
        <el-dialog
            width="500px"
            :visible="show"
            @close="cancel()"
        >
            <div class="content">
                您正在使用 <span class="red">后台无码方式</span>核销该笔订单的 <span class="red">{{ redeemCodeNum }}个核销码</span>确认核销吗？
            </div>
            <el-button @click="codeVerification()" style="margin-top: 15px" type="text">
                我有核销码->
            </el-button>
            <div
                slot="footer"
            >
                <el-button @click="cancel()">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="confirm()"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { batchAuditredeemcode } from '../../apis/order'
export default {
    name: 'UncodedVerification',
    props: {
        show: Boolean,
        redeemCodeNum: {
            type: Number,
            required: true
        },
        orderId: {
            type: String,
            required: true
        }
    },
    methods: {
        async confirm () {
            await batchAuditredeemcode({ orderId: this.orderId })
            await this.$success('核销成功')
            this.$emit('update:show', false)
            this.$emit('success')
        },
        cancel () {
            this.$emit('update:show', false)
        },
        codeVerification () {
            this.$emit('update:show', false)
            this.$emit('codeVerification', true)
        }
    }
}
</script>

<style scoped lang="scss">
.content{
  font-size: 14px;
  color: #333333;
}
</style>
