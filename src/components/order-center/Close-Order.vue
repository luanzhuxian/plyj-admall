<template>
    <div>
        <el-dialog
            title="关闭订单"
            :visible="show"
            width="500px"
            @close="close"
        >
            <el-form label-position="left">
                <el-form-item
                    label="关闭原因:"
                    label-width="100px"
                >
                    <el-select
                        @change="messageChange()"
                        v-model="closeOrderForm.message"
                        style="width: 320px;"
                    >
                        <el-option
                            v-for="(item,index) of closeOrderDataList"
                            :key="index"
                            :label="item.dictDataValue"
                            :value="item.dictDataKey"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="100px"
                    v-if="closeOrderForm.message === 'OTHER'"
                >
                    <el-input
                        validate-event
                        type="text"
                        style="width: 320px;"
                        placeholder="请输入关闭原因"
                        v-model="closeOrderForm.messageText"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
            >
                <el-button @click="close ()">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    @click="closeConfirm"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getDataDictionary } from '../../apis/common'
import { cancelOrder } from '../../apis/order'
import { resetForm } from '../../assets/ts/utils'
export default {
    name: 'CloseOrder',
    data () {
        return {
            closeOrderForm: {
                message: '',
                messageText: ''
            },
            closeOrderDataList: []
        }
    },
    props: {
        show: Boolean,
        orderId: {
            type: String,
            default: ''
        }
    },
    watch: {
        async show (val) {
            if (val) {
                try {
                    await this.getCancelOrderData()
                } catch (e) {
                    throw e
                }
            } else {
                resetForm(this.closeOrderForm)
            }
        }
    },
    methods: {
        messageChange () {
            if (this.closeOrderForm.message !== 'OTHER') {
                for (const item of this.closeOrderDataList) {
                    if (item.dictDataKey === this.closeOrderForm.message) {
                        this.closeOrderForm.messageText = item.dictDataValue
                    }
                }
            } else {
                this.closeOrderForm.messageText = ''
            }
        },
        async closeConfirm () {
            if (!this.closeOrderForm.messageText) {
                this.$warning('关闭原因不能为空')
                return
            }
            try {
                const data = { orderId: this.orderId, message: this.closeOrderForm.messageText }
                await cancelOrder(data)
                await this.$success('操作成功')
                this.$emit('success', true)
                this.close()
            } catch (e) {
                throw e
            }
        },
        async getCancelOrderData () {
            const { result } = await getDataDictionary('CANCELREASON')
            this.closeOrderDataList = result || []
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped>

</style>
