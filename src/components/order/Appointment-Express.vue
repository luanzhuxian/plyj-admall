<template>
    <!-- 预约取件 -->
    <el-dialog
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="show"
        width="40%"
        title="预约取件"
        @close="close"
    >
        <el-form
            :rules="rules"
            :model="form"
            ref="form"
            label-width="110px"
        >
            <el-form-item
                label="选择快递公司"
                prop="courierCompany"
            >
                <el-select
                    v-model="form.courierCompany"
                    style="width: 400px;"
                >
                    <el-option
                        v-for="(item,index) of expressData"
                        :label="item.dictDataValue"
                        :value="item.dictDataKey"
                        :key="index"
                        :disabled="!item.supportReservation"
                    >
                        <span v-text="item.dictDataValue" />
                        <span
                            v-if="!item.supportReservation"
                            style="float: right; color: #992000; font-size: 12px;"
                        >
                            不支持预约
                        </span>
                        <span
                            v-else-if="!item.supportCancelReservation"
                            style="float: right; color: #999; font-size: 12px;"
                        >
                            预约成功后，不支持取消预约
                        </span>
                        <span
                            v-else
                            style="float: right; color: #00976a; font-size: 12px;"
                        >
                            预约成功后，支持取消预约
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="addressSeq"
                label="选择取件地址"
            >
                <el-select
                    v-model="form.addressSeq"
                    style="width: 400px;"
                >
                    <el-option
                        v-for="(item, index) of addressList"
                        :label="item.addressPrefix + item.agencyAddress"
                        :value="item.sequenceNbr"
                        :key="index"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="取件时间"
                prop="startTime"
            >
                <el-date-picker
                    v-model="datetimerange"
                    type="datetimerange"
                    align="right"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    :default-time="['08:00:00', '17:00:00']"
                    @change="datetimeChange"
                    :picker-options="{ disabledDate }"
                    :editable="false"
                />
                <p style="color: #999;">
                    快递公司取件时间为 08:00 ~ 18:00
                </p>
            </el-form-item>
            <div style="text-align: center;">
                <el-button @click="$emit('update:show', false)">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    @click="scheduleAPickup"
                >
                    确定
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { resetForm } from '../../assets/ts/utils'
import {
    courierCompany
} from '../../apis/order'
import moment from 'moment'
export default {
    name: 'AppointmentExpress',
    data () {
        return {
            form: {
                orderSn: '',
                courierCompany: '',
                addressSeq: '',
                startTime: '',
                endTime: ''
            },
            rules: {
                courierCompany: [{ required: true, message: '请输选择流公司名称' }],
                addressSeq: [{ required: true, message: '请选择取件地址' }],
                startTime: [{ required: true, message: '请选择取件时间' }]
            },
            datetimerange: [],
            defaultAddress: null
        }
    },
    props: {
        show: Boolean,
        expressData: {
            type: Array,
            default () {
                return []
            }
        },
        addressList: {
            type: Array,
            default () {
                return []
            }
        },
        orderId: {
            type: [String, Number],
            default: ''
        }
    },
    watch: {
        addressList: {
            handler (val) {
                const defaultAddress = val.find(item => item.defaultAddress === 'YES')
                this.defaultAddress = defaultAddress || val[0]
                if (defaultAddress) {
                    this.form.addressSeq = defaultAddress.sequenceNbr
                }
            },
            immediate: true,
            deep: true
        },
        show (val) {
            if (!val) {
                this.$nextTick(() => {
                    this.form.startTime = ''
                    this.form.endTime = ''
                    this.datetimerange = []
                    this.$nextTick(() => {
                        this.$refs.form.clearValidate()
                    })
                })
            }
        }
    },

    methods: {
        disabledDate (date) {
            const curr = new Date()
            return date.getTime() - (curr.getTime() - curr.getHours() * 3600000 - curr.getMinutes() * 60000 - curr.getSeconds() * 1000 - curr.getMilliseconds()) < 0
        },
        datetimeChange (val) {
            const curr = new Date()
            if (val[0].getTime() < curr.getTime()) {
                val[0] = curr
                this.datetimerange.splice(0, 1, curr)
            }
            if (val[1].getTime() < curr.getTime()) {
                val[1] = curr
                this.datetimerange.splice(1, 1, curr)
            }
            if (val[0].getHours() < 8 || val[0].getHours() >= 18 || val[1].getHours() < 8 || val[1].getHours() >= 18) {
                this.$alert('取件时间必须在08:00到18:00之间')
                this.form.startTime = ''
                this.form.endTime = ''
                this.datetimerange.splice(0, 2)
                return
            }

            this.form.startTime = moment(val[0]).format('YYYY-MM-DD HH:mm:ss')
            this.form.endTime = moment(val[1]).format('YYYY-MM-DD HH:mm:ss')
        },
        async scheduleAPickup () {
            this.$refs.form.validate(async val => {
                if (val) {
                    const address = this.addressList.find(item => item.sequenceNbr === this.form.addressSeq)
                    const logistics = this.expressData.find(item => item.dictDataKey === this.form.courierCompany)
                    const h = this.$createElement
                    await this.$confirm({
                        title: '请确认取件信息',
                        type: '',
                        confirmButtonText: '确定预约',
                        message: h('div', [
                            h('p', null, [
                                h('strong', null, '您选择的地址是：'),
                                address.addressPrefix + address.agencyAddress
                            ]),
                            h('p', null, [
                                h('strong', null, '您选择的快递公司是：'),
                                logistics.dictDataValue
                            ]),
                            h('p', null, [
                                h('strong', null, '您的联系电话是：'),
                                address.mobile
                            ]),
                            h('p', null, [
                                h('strong', null, '预约取件时间是：'),
                                `${ this.form.startTime } 至 ${ this.form.endTime }`
                            ]),
                            h('br'),
                            h('p', null, '确认无误后点击 “确定预约” 按钮提交预约。'),
                            h('p', null, '预约成功后请保持您预留电话畅通，以便快递公司联系您。')
                        ])
                    })
                    try {
                        this.form.orderSn = this.orderId
                        await courierCompany(this.form)
                        this.$emit('update:show', false)
                        this.$emit('success')
                    } catch (e) {
                        throw e
                    }
                }
            })
        },
        close () {
            this.$refs.form.clearValidate()
            resetForm(this.form, {
                addressSeq: this.defaultAddress.sequenceNbr
            })
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped lang="scss">

</style>
