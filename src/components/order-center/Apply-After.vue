<template>
    <div>
        <el-dialog
            title="申请售后"
            :visible="show"
            @close="close"
        >
            <el-form label-position="left">
                <el-form-item
                    label="操作备注:"
                    label-width="100px"
                >
                    <el-input
                        type="text"
                        placeholder="请输入操作备注"
                        style="width: 210px;"
                        maxlength="100"
                        v-model="afterForm.applyContent"
                    />
                </el-form-item>
                <el-form-item
                    label="申请售后商品:"
                    label-width="100px"
                >
                    <div class="list-goods">
                        <div class="goods-item active">
                            <i class="el-icon-success" />
                            <img :src="applyAfterData.goodsImage || applyAfterData.img">
                        </div>
                    </div>
                </el-form-item>
                <el-form-item
                    label="服务类型:"
                    label-width="100px"
                    v-if="applyAfterData.orderType === 'PHYSICAL_GOODS' || applyAfterData.goodsType === 'PHYSICAL_GOODS'"
                >
                    <el-radio-group v-model="afterForm.refundType">
                        <el-radio
                            v-for="(item,index) of afterTypeList"
                            :key="index"
                            :label="item.dictDataKey"
                        >
                            {{ item.dictDataValue }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="退款金额(元):"
                    label-width="100px"
                    v-if="afterForm.refundsMaxAmount"
                >
                    {{ afterForm.refundsMaxAmount/100 }}
                </el-form-item>
            </el-form>
            <div
                slot="footer"
            >
                <el-button @click="close()">
                    取消申请
                </el-button>
                <el-button
                    type="primary"
                    @click="applyRefund"
                >
                    立即申请
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getDataDictionary } from '../../apis/common'
import { refundApply, refundsMaxAmount } from '../../apis/order'
import { resetForm } from '../../assets/ts/utils'
export default {
    name: 'ApplyAfter',
    props: {
        show: Boolean,
        orderId: {
            type: String,
            default: ''
        },
        applyAfterData: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            // 售后类型数据字典
            afterTypeList: [],
            // 售后填写信息
            afterForm: {
                applyContent: '',
                refundType: '1',
                // 退款最大金额
                refundsMaxAmount: ''
            }
        }
    },
    watch: {
        async show (val) {
            if (val) {
                try {
                    await this.getRefundsMaxAmount()
                } catch (e) {
                    throw e
                }
            } else {
                resetForm(this.afterForm)
                this.afterForm.refundType = '1'
            }
        }
    },
    methods: {
    // 获取退货最大金额
        async getRefundsMaxAmount () {
            const { data: { result } } = await refundsMaxAmount({ orderId: this.orderId })
            this.afterForm.refundsMaxAmount = result
            if (this.applyAfterData.orderStatus === 'WAIT_SHIP') this.afterForm.refundType = '2'
            // 获取售后类型
            if (this.applyAfterData.orderType === 'PHYSICAL_GOODS' || this.applyAfterData.goodsType === 'PHYSICAL_GOODS') {
                // 实体商品售后类型数据字典
                const { data: result } = await getDataDictionary('refundType')
                this.afterTypeList = result.result || []
            } else {
                this.afterForm.refundType = '2'
                // 虚拟商品售后类型数据字典
                const { data: result } = await getDataDictionary('refundTypeForVirtualAndClass')
                this.afterTypeList = result.result || []
            }
        },
        async applyRefund () {
            if (!this.afterForm.applyContent) {
                this.$warning('操作备注不能为空')
                return
            }
            try {
                await refundApply({
                    orderId: this.applyAfterData.orderId,
                    amount: this.afterForm.refundsMaxAmount,
                    content: this.afterForm.applyContent,
                    type: this.afterForm.refundType
                })
                await this.$success('申请售后成功')
                this.$emit('success', true)
                this.close()
            } catch (e) {
                throw e
            }
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped lang="scss">
  .list-goods {
    display: flex;
    align-items: center;

    .goods-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      margin-right: 10px;
      border: 1px solid #cccccc;
      border-radius: 5px;
      position: relative;

      i {
        color: #999999;
        font-size: 18px;
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 99;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .active {
      border: 1px solid #F2B036;

      i {
        color: #F2B036;
      }
    }
  }
</style>
