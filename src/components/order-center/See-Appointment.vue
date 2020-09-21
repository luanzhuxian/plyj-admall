<template>
    <el-dialog
        title="查看预约"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="show"
        @close="close"
    >
        <el-table :data="[appointmentData]">
            <el-table-column
                label="选择物流"
                prop="courierCompany"
                width="100px"
            />
            <el-table-column
                label="取件时间"
                prop="pickupTime"
                width="300px"
            />
            <el-table-column label="发货信息">
                <template slot-scope="{ row }">
                    <span v-text="row.senderModel.name" />&nbsp;
                    <span v-text="row.senderModel.mobile" />&nbsp;
                    <span v-text="row.senderModel.address" />
                </template>
            </el-table-column>
        </el-table>
        <div
            style="text-align: center; margin-top: 32px;"
            v-if="appointmentCanCancel"
        >
            <el-button @click="cancelCourier">
                取消预约
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import {
    cancelCourier,
    queryPickup
} from '../../apis/order'
export default {
    name: 'SeeAppointment',
    data () {
        return {
            appointmentData: {
                senderModel: {}
            },
            // 是否可取消预约
            appointmentCanCancel: true
        }
    },
    props: {
        show: Boolean,
        orderId: {
            type: [String, Number],
            default: ''
        }
    },
    watch: {
        async show (val) {
            if (val) {
                try {
                    const { data } = await queryPickup(this.orderId)
                    this.appointmentData = data.result
                    this.appointmentCanCancel = data.result.appointmentCanCancel
                } catch (e) {
                    throw e
                }
            }
        }
    },
    methods: {
        async cancelCourier () {
            const { orderId, courierCompanyCode } = this.appointmentData
            try {
                await this.$confirm('确定取消预约吗？')
                const { data } = await cancelCourier(orderId, courierCompanyCode)
                if (data.result) {
                    this.$emit('success')
                    this.$emit('update:show', false)
                } else {
                    this.$error('取消失败')
                }
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

<style scoped>

</style>
