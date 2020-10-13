<template>
    <div>
        <el-dialog
            :visible="show"
            width="400px"
            title="确定拒绝该退款退货/退款申请吗？"
            @close="close"
        >
            <el-form label-position="left">
                <el-form-item
                    label="驳回原因："
                    label-width="100px"
                >
                    <el-select
                        v-model="turndownReason"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in optionsReason"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
            >
                <el-button @click="close">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirm"
                >确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getDataDictionary } from '../../apis/common'
import { returnOrdersListTurnDown } from '../../apis/order'
export default {
    name: 'BackorderTurndown',
    data () {
        return {
            turndownReason: '',
            optionsReason: []
        }
    },
    props: {
        show: Boolean,
        orderId: {
            type: String,
            required: true
        }
    },
    watch: {
        async show (val) {
            if (val) {
                try {
                    await this.getDataDictionaryFun()
                } catch (e) {
                    throw e
                }
            } else {
                this.optionsReason = []
                this.turndownReason = ''
            }
        }
    },
    methods: {
        async confirm () {
            if (!this.turndownReason) {
                this.$warning('请选择驳回原因')
                return
            }
            const data = {
                id: this.orderId,
                message: this.turndownReason.split('-')[1]
                // operationContent: this.turndownReason.split('-')[1]
            }
            try {
                await returnOrdersListTurnDown(data)
                await this.$success('操作成功')
                this.$emit('success', true)
                this.close()
            } catch (e) {
                throw e
            }
        },
        async getDataDictionaryFun () {
            const { result } = await getDataDictionary('refundRejectReason')
            for (const item of result) {
                this.optionsReason.push({ value: `${ item.dictDataKey }-${ item.dictDataValue }`, label: item.dictDataValue })
            }
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>
