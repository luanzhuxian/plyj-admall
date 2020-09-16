<template>
    <div class="wechat-pay-step3">
        <h4>企业法人 (微信商户平台超级管理员)</h4>

        <el-form
            label-width="150px"
            label-position="left"
            :rules="rule"
            :model="form"
            ref="form"
        >
            <el-form-item label="账户类型">
                <span v-if="form.bankAccountType === 'BANK_ACCOUNT_TYPE_CORPORATE'">对公账户</span>
                <span v-if="form.bankAccountType === 'BANK_ACCOUNT_TYPE_PERSONAL'">个人银行卡</span>
            </el-form-item>

            <el-form-item label="开户名称" prop="accountName">
                <span v-text="form.accountName" />
            </el-form-item>

            <el-form-item label="基本户开户行" prop="accountBank">
                <el-select
                    style="width: 184px"
                    v-model="form.accountBank"
                    @change="bankChange"
                >
                    <el-option
                        v-for="(item, i) of bankList"
                        :key="i"
                        :label="item.bankFullName"
                        :value="item.bankFullName"
                    />
                </el-select>
                <span class="tip">
                    （城市商业银行、农村商业银行、信用合作联社及其他银行，请选择“其他银行”）
                </span>
            </el-form-item>

            <el-form-item label="基本户开户行支行" prop="bankName">
                <CityPickerWexin
                    :disabled="!form.accountBank"
                    v-model="form.bankAddressCode"
                    :default="defaultAddress"
                />
                <el-select
                    style="width: 200px"
                    class="mr-10"
                    v-model="form.bankName"
                    placeholder="支行"
                    remote
                    filterable
                    :remote-method="bankFilter"
                    :disabled="!form.accountBank || !form.bankAddressCode"
                >
                    <el-option
                        v-for="(item, i) of subBankList"
                        :key="i"
                        :label="item.bankFullName"
                        :value="item.bankFullName"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="银行账号" prop="accountNumber">
                <el-input
                    v-model.trim="form.accountNumber"
                    placeholder="请输入银行账号"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    getBankList,
    getSubBankList,
    wechatPayStep3
} from '../../../../apis/base/register'
import CityPickerWexin from './City-Picker-Wexin.vue'

export default {
    name: 'WechatPayStep3',
    components: {
        CityPickerWexin
    },
    data () {
        return {
            form: {
                bankAccountType: 'BANK_ACCOUNT_TYPE_CORPORATE',
                accountName: '',
                accountBank: '',
                bankAddressCode: '',
                bankName: '',
                accountNumber: ''
            },
            rule: {
                accountBank: [{ required: true, message: '请选择开户行', trigger: 'blur' }],
                bankName: [{ required: true, message: '请选择开户支行', trigger: 'blur' }],
                accountNumber: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur' },
                    { min: 2, max: 50, message: '银行卡号长位数不能超过50个字符', trigger: 'blur' }
                ]
            },
            bankList: [],
            subBankList: [],
            defaultAddress: []
        }
    },
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    watch: {
        detail: {
            handler (val) {
                const {
                    bankAccountType = '',
                    accountBank = '',
                    bankAddressCode = '',
                    bankName = '',
                    accountNumber = '',
                    bankAddressCode1 = '',
                    bankAddressCode2 = '',
                    bankAddressCode3 = '',
                    organizationType = '',
                    entName = '',
                    legalPerson = ''
                } = val
                this.form = {
                    bankAccountType: bankAccountType || (organizationType === 'SUBJECT_TYPE_INDIVIDUAL' ? 'BANK_ACCOUNT_TYPE_PERSONAL' : 'BANK_ACCOUNT_TYPE_CORPORATE'),
                    accountName: organizationType === 'SUBJECT_TYPE_INDIVIDUAL' ? legalPerson : entName,
                    accountBank,
                    bankAddressCode,
                    bankName,
                    accountNumber
                }
                this.defaultAddress = [
                    bankAddressCode1,
                    bankAddressCode2,
                    bankAddressCode3
                ]
            },
            immediate: true
        }
    },
    async created () {
        try {
            const { result: bank } = await getBankList()
            this.bankList = bank
        } catch (e) {
            throw e
        }
    },
    methods: {
        bankChange (val) {
            this.bankCode = this.bankList.find(item => item.bankFullName === val).bankNumber
        },
        async getSubBankList (keyword) {
            try {
                const { result } = await getSubBankList(this.bankCode, this.form.accountBank, keyword)
                this.subBankList = result.records
            } catch (e) {
                throw e
            }
        },
        bankFilter (val) {
            val = val.trim()
            this.getSubBankList(val)
        },
        async submit () {
            try {
                await this.$refs.form.validate()
                const { result } = await wechatPayStep3(this.form)
                return result
            } catch (e) {
                if (e) throw e
                return false
            }
        }
    }
}
</script>

<style module lang="scss">
  .step3 {
  }
</style>
