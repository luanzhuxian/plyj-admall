<template>
    <div class="wechat-pay-step4">
        <p class="tip mb-24">
            请填写超级管理员信息，超级管理员需在开启后进行签约，并接受日常重要信息和资金操作，请确定其为商户法定代表人或负责人
        </p>
        <el-form
            label-width="150px"
            label-position="left"
            :rules="rules"
            :model="form"
            ref="form"
        >
            <el-form-item label="超管身份" required>
                <el-radio-group v-model="form.contactType" @change="contactTypeChange">
                    <el-radio :label="1">
                        法定代表人/经营者
                        <el-tooltip class="item" effect="dark" content="若超管为法定代表人/经营者，则该商户入驻流程为：提交申请 - 平台审核 - 超管签约 - 完成入驻" placement="bottom-start">
                            <pl-svg :class="$style.tipSvg" name="icon-jinggao" width="16" fill="#333" />
                        </el-tooltip>
                    </el-radio>
                    <el-radio :label="2">
                        负责人
                        <el-tooltip class="item" effect="dark" content="若超管为负责人，则该商户入驻流程为：提交申请 - 平台审核 -账户验证- 超管签约 - 完成入驻" placement="bottom-start">
                            <pl-svg :class="$style.tipSvg" name="icon-jinggao" width="16" fill="#333" />
                        </el-tooltip>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="超管姓名" prop="contact">
                <el-input v-if="form.contactType === 2" v-model="form.contact" />
                <span v-else v-text="form.contact" />
            </el-form-item>
            <el-form-item label="超管资料类型" required>
                <span class="tip">身份证 (仅中国大陆居民)</span>
            </el-form-item>
            <el-form-item label="证件号码" prop="contactIdNumber">
                <el-input v-if="form.contactType === 2" v-model="form.contactIdNumber" />
                <p v-else v-text="form.contactIdNumber" />
                <p class="tip">
                    请填写超级管理员的身份证证件号码
                </p>
            </el-form-item>
            <el-form-item label="手机号码" prop="contactPhone">
                <el-input
                    placeholder="请输入手机号码"
                    v-model.trim="form.contactPhone"
                />
                <p class="tip">
                    用于接收微信支付的重要管理信息及日常操作验证码，在超管签约时进行短信验证
                </p>
            </el-form-item>
            <el-form-item label="常用邮箱" prop="contactEmail">
                <el-input
                    type="email"
                    placeholder="请输入常用邮箱"
                    v-model.trim="form.contactEmail"
                />
                <p class="tip">
                    用于接收微信支付的开户邮件及日常业务通知
                </p>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { testPhone, testIdCard } from '../../../../assets/ts/validate'
import { wechatPayStep4 } from '../../../../apis/base/register'
export default {
    name: 'WechatPayStep4',
    data () {
        return {
            form: {
                contactType: 1,
                contact: '',
                contactIdNumber: '',
                contactPhone: '',
                contactEmail: ''
            },
            rules: {
                contactEmail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
                ],
                contact: [
                    { required: true, message: '请输入超管姓名', trigger: 'blur' }
                ],
                contactIdNumber: [
                    { required: true, message: '请输入身份证号码', trigger: 'blur' },
                    { validator: testIdCard, message: '身份证号码格式错误', trigger: 'blur' }
                ],
                contactPhone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: testPhone, message: '手机号格式错误', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        detail: {
            handler (val) {
                const { contact, idCardName, contactIdNumber, idCardNumber, contactType, contactPhone, contactEmail } = val
                this.form = {
                    contact: contactType === 2 ? contact : idCardName,
                    contactIdNumber: contactType === 2 ? contactIdNumber : idCardNumber,
                    contactType: contactType || 1,
                    contactPhone,
                    contactEmail
                }
            },
            immediate: true
        }
    },
    props: {
        detail: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        async submit () {
            try {
                await this.$refs.form.validate()
                const { result } = await wechatPayStep4(this.form)
                return result
            } catch (e) {
                throw e
            }
        },
        contactTypeChange (val) {
            this.$refs.form.clearValidate()
            if (val === 1) {
                this.form.contact = this.detail.idCardName || ''
                this.form.contactIdNumber = this.detail.idCardNumber || ''
            } else {
                this.form.contact = this.detail.contact || ''
                this.form.contactIdNumber = this.detail.contactIdNumber || ''
            }
        }
    }
}
</script>

<style module lang="scss">
  .tipSvg {
    margin-left: 6px;
    vertical-align: -4px;
  }
</style>
