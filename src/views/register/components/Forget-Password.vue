<template>
    <div :class="$style.phoneLogin">
        <div :class="$style.loginType">
            忘记密码
        </div>
        <div :class="$style.accountMessage">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                size="large"
            >
                <el-form-item prop="mobile">
                    <div :class="$style.phoneNumber">
                        +86 <el-input v-model="form.mobile" type="number" maxlength="11" style="width: 200px" placeholder="请输入手机号" />
                    </div>
                </el-form-item>
                <el-form-item prop="verifyCode">
                    <div :class="$style.phoneCode">
                        <el-input v-model="form.verifyCode" maxlength="4" style="width: 220px" placeholder="请输入验证码" />
                        <get-code ref="child" @errorMobile="errorMobile" :mobile="form.mobile" sms-type="AGENCY_MOBILE_PASSWD_REST" />

                    </div>
                </el-form-item>
            </el-form>
            <el-button
                size="large"
                style="width: 100%;border-radius: 121px;"
                type="primary"
                @click.native.prevent="login()"
                :loading="loading"
            >
                下一步
            </el-button>
            <div :class="$style.register">
                <el-button @click="$router.push({name:'PhoneLogin'})" type="text"><span :class="$style.c999">已有账号？</span>马上登录</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import GetCode from '@/components/common/Get-Code.vue'
import { testPhone } from '../../../assets/ts/validate'
import { Component, Vue, Emit } from 'vue-property-decorator'
import { forgetPassword } from '../../../apis/base/register'
import { Getter, namespace } from 'vuex-class'
import { MutationTypes } from '@/store/mutation-type'
const userModule = namespace('user')

    @Component({ components: { GetCode } })
export default class ForgetPassword extends Vue {
        form = {
            mobile: '',
            verifyCode: ''
        }

        rules = {
            mobile: [
                { required: true, trigger: 'blur', message: '手机号码不能为空' },
                { validator: testPhone, trigger: 'blur', message: '请输入11位手机号码' }
            ],
            verifyCode: [
                { required: true, message: '验证码不能为空', trigger: 'blur' },
                { min: 4, message: '验证码不能小于4位', trigger: 'blur' }
            ]
        }

        loading = false
        @userModule.Mutation(MutationTypes.setCodePass) setCodePass!: Function
        @userModule.Mutation(MutationTypes.setCodeShow) setCodeShow!: Function
        @Getter smsType!: string[]

        @Emit('codeShowFoo')
        codeShowFoo (e: object) {
            return e
        }

        mounted (): void {
            this.setCodePass(false)
        }

        errorMobile () {
            (this.$refs.form as HTMLFormElement).validateField('mobile')
        }

        async getCode () {
            try {
                await (this.$refs.child as HTMLFormElement).getCode()
            } catch (e) {
                throw e
            }
        }

        async login () {
            // 防止连续敲击回车
            if (this.loading) return
            try {
                await (this.$refs.form as HTMLFormElement).validate()
                this.loading = true
                const data = await forgetPassword(this.form)
                if (!data) return this.$error('操作失败')
                this.$router.replace({ name: 'ResetPassword', params: { code: `${ this.form.mobile }&${ this.form.verifyCode }` } })
            } catch (e) {
                // this.refreshSafeCode()
                throw e
            } finally {
                this.loading = false
            }
        }
}
</script>

<style module lang="scss">
    .c999{
        color: #999999
    }
    .phone-login{
        width: 400px;
        height: 380px;
        padding: 40px;
        border-radius: 10px;
        background-color: #ffffff;
        >img{
            position: absolute;
            top: 0;
            right: 0;
        }
        .login-type{
            display: flex;
            justify-content: center;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
        }
        .account-message{
            margin-top: 36px;
            border-radius: 10px;
            input{
                border: none;
            }
            .phone-number{
                width: 100%;
                display: flex;
                align-items: center;
                padding-bottom: 8px;
                box-shadow: 0px 1px 0px #E7E7E7;
                color: #333333;
                font-size: 14px;
            }
            .unregistered-phone{
                padding-top: 2px;
                font-size: 12px;
                font-weight: 400;
                color: #E63600;
            }
            .phone-code{
                width: 100%;
                height: 52px;
                display: flex;
                padding-top: 10px;
                padding-bottom: 8px;
                box-shadow: 0px 1px 0px #E7E7E7;
                input{
                    padding-left: 0;
                }
                >.get-code{
                    display: flex;
                    align-items: center;
                    padding: 6px 12px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #4F63FF;
                    border: 1px solid #4F63FF;
                    border-radius: 17px;
                    cursor: pointer;
                }
            }
            .register{
                display: flex;
                justify-content: center;
                margin-top: 20px;
                >button{
                    margin: 0;
                }
            }
        }
    }
</style>
