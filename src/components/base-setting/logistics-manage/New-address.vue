<template>
    <div>
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible="show"
            :title="dialogTitle"
            width="500px"
            @close="close()"
        >
            <el-form
                label-width="80px"
                :model="form"
                :rules="rules"
                ref="form"
            >
                <el-form-item
                    label="姓名"
                    prop="realName"
                >
                    <el-input
                        v-model="form.realName"
                        placeholder="请输入姓名"
                    />
                </el-form-item>
                <el-form-item
                    label="联系电话"
                    prop="mobile"
                >
                    <el-input
                        v-model="form.mobile"
                        placeholder="请输入联系电话"
                    />
                </el-form-item>
                <el-form-item
                    label="地区"
                    prop="addressPrefix"
                >
                    <CityPicker
                        @selected="selectedCity"
                        :default-value="addressCode"
                    />
                </el-form-item>
                <el-form-item
                    label="详细地址"
                    prop="agencyAddress"
                >
                    <el-input
                        v-model="form.agencyAddress"
                        placeholder="请输入详细地址"
                    />
                </el-form-item>
                <el-form-item>
                    <el-switch
                        v-model="form.defaultAddress"
                        active-value="YES"
                        inactive-value="NO"
                    />
                    <span class="labelTitleText">是否默认</span>
                </el-form-item>
                <el-form-item v-if="!sequenceNbr && ($route.name === 'DeliveryAddress' || $route.name === 'ShippingAddress')">
                    <div>
                        <el-switch
                            v-model="form.synchronize"
                            active-value="YES"
                            inactive-value="NO"
                        />
                        <span class="labelTitleText">{{ labelTitleText }}</span>
                        <el-checkbox v-if="form.synchronize === 'YES'" v-model="defaultSynchronize">
                            是否默认
                        </el-checkbox>
                    </div>
                </el-form-item>
            </el-form>
            <div
                style="text-align: right"
                class="mb-20"
            >
                <el-button
                    @click="close()"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="save"
                >
                    提 交
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    createAddress,
    updateAddress
} from '../../../apis/address'
import CityPicker from '../../common/City-Picker.vue'
import { resetForm } from '../../../assets/ts/utils'
export default {
    name: 'NewAddress',
    components: {
        CityPicker
    },
    data () {
        return {
            form: {
                // string 国家代码
                country: '',
                // string 省自治区代码
                province: '',
                // string 市代码
                city: '',
                // string 地区代码
                region: '',
                // string 省市区
                addressPrefix: '',
                // string 地址
                agencyAddress: '',
                // string 联系电话1
                mobile: '',
                // string 收货人名称
                realName: '',
                defaultAddress: 'NO',
                // 街道、镇、乡
                town: '',
                // 发货地址1  退货地址3
                type: '',
                synchronize: 'NO',
                defaultSynchronize: 'NO'
            },
            addressCode: [],
            defaultSynchronize: false,
            rules: {
                realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
                addressPrefix: [{ required: true, message: '请选择地址', trigger: 'blur' }],
                agencyAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
            }
        }
    },
    props: {
        show: Boolean,
        sequenceNbr: {
            type: String,
            default: ''
        },
        addressType: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    computed: {
        dialogTitle () {
            return this.sequenceNbr ? '修改地址' : '添加地址'
        },
        labelTitleText () {
            return this.addressType === 'DeliveryAddress' ? '复制到退货地址' : '复制到收货地址'
        }
    },
    watch: {
        show (val) {
            if (!val) {
                // 关闭dialog时，重置表单
                resetForm(this.form, {
                    defaultAddress: 'NO',
                    synchronize: 'NO',
                    defaultSynchronize: 'NO'
                })
                this.$refs.form.clearValidate()
                this.$emit('clearData')
            } else {
                const arr = Object.keys(this.data)
                if (arr) {
                    this.form = JSON.parse(JSON.stringify(this.data))
                    this.addressCode = [this.data.province, this.data.city, this.data.region, this.data.town]
                }
            }
        }
    },
    methods: {
        save () {
            this.$refs.form.validate(async val => {
                if (val) {
                    try {
                        this.addressType === 'DeliveryAddress' ? this.form.type = 1 : this.form.type = 3
                        if (this.defaultSynchronize) {
                            this.form.defaultSynchronize = 'YES'
                        } else {
                            this.form.defaultSynchronize = 'NO'
                        }
                        if (this.sequenceNbr) {
                            await updateAddress({ data: this.form, sequenceNbr: this.sequenceNbr })
                        } else {
                            await createAddress(this.form)
                        }
                        this.$emit('refreshList')
                        this.$emit('update:show', false)
                    } catch (e) {
                        throw e
                    }
                }
            })
        },
        selectedCity (val) {
            const form = this.form
            form.province = val[0].code
            form.city = val[1].code
            form.region = val[2] ? val[2].code : ''
            form.town = val[3] ? val[3].code : ''
            form.addressPrefix = val[0].name +
          val[1].name +
          (val[2] ? val[2].name : '') +
          (val[3] ? val[3].name : '')
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped lang="scss">
.labelTitleText{
  padding: 0 10px;
  display: inline-flex;
}
</style>
