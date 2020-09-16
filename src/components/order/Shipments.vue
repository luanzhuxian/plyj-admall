<template>
    <div class="shipments">
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="true"
            :visible="show"
            title="商品发货"
            width="500px"
            @close="close"
        >
            <el-form
                :model="form"
                size="small"
                :rules="rules"
                label-width="100px"
                label-position="left"
                ref="shipForm"
                style="margin-top: 20px;"
            >
                <el-form-item
                    label="发货商品"
                >
                    <span>
                        {{ products.goodsName || products.name }}
                    </span>
                    <span>x{{ products.count }}</span>
                </el-form-item>
                <el-form-item
                    prop="logisticsCompany"
                    label="物流公司"
                >
                    <el-select
                        v-model="form.logisticsCompany"
                        style="width: 168px;"
                    >
                        <el-option
                            v-for="(item,index) of companyList"
                            :label="item.dictDataValue"
                            :value="item.dictDataValue"
                            :key="index"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="logisticsNo"
                    label="物流单号"
                >
                    <el-input
                        v-model="form.logisticsNo"
                        style="width: 210px;"
                    />
                </el-form-item>
            </el-form>
            <div
                style="text-align: center;"
                class="mt-20"
            >
                <el-button
                    size="small"
                    @click="close"
                >
                    取消
                </el-button>
                <el-button
                    size="small"
                    type="primary"
                    :loading="loading"
                    @click="confirmShip"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    physicalorderShipment, getCompany
} from '../../apis/order'
import { resetForm } from '../../assets/ts/utils'
import { testExpressNumber } from '../../assets/ts/validate'

export default {
    name: 'Shipments',
    props: {
        show: Boolean,
        products: {
            type: Object,
            default () {
                return {}
            }
        },
        orderId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            companyList: [],
            loading: false,
            expand: true,
            form: {
                orderId: '',
                logisticsCompany: '',
                logisticsNo: ''
            },
            rules: {
                logisticsCompany: [{ required: true, message: '请输选择流公司名称' }],
                logisticsNo: [
                    { required: true, message: '请输入物流单号' },
                    { validator: testExpressNumber, message: '请输入正确的物流单号', trigger: 'blur' }
                ]
            },
            listHeight: 0
        }
    },
    watch: {
        async show (val) {
            if (this.$refs.shipForm) {
                this.$refs.shipForm.clearValidate()
            }
            if (val) {
                try {
                    await this.getCompanyList()
                } catch (e) {
                    throw e
                }
            } else {
                resetForm(this.form)
            }
        }
    },
    methods: {
        async getCompanyList () {
            const { data: { result } } = await getCompany({ goodId: this.products.goodsId })
            this.companyList = result || []
        },
        // 确认发货按钮
        async confirmShip () {
            this.form.orderId = this.orderId
            try {
                await this.$refs.shipForm.validate()
                this.loading = true
                await physicalorderShipment(this.form)
                this.$emit('update:show', false)
                this.$emit('success', true)
                this.$success('发货成功')
                resetForm(this.form)
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>
